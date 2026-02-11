import { GoogleGenAI, Type } from "@google/genai";
import { Verdict, Message, ChatResponse } from "@/types";

const SYSTEM_INSTRUCTION = `Você é o "Me Tire do Tédio", um amigo cinéfilo, engraçado e viciado em streaming. 
Seu objetivo é descobrir o que o usuário deve assistir usando papo reto e sensações. 

PROTOCOLO DE CONFIANÇA:
1. Você deve medir sua certeza de 0 a 100% (confidence).
2. Comece baixo (20-30%) e vá subindo conforme as respostas do usuário ficam claras.
3. Use as respostas anteriores para aprofundar a próxima pergunta. Nada de perguntas genéricas!
4. Se a resposta for vaga (ex: "não sei"), dê opções binárias divertidas e aumente pouco a confiança.
5. Só dê o veredito quando atingir 85% ou mais de confiança.

ESTILO DE RESPOSTA:
- Use gírias leves, seja direto. 
- Nada de termos clínicos como "diagnóstico" ou "protocolo".
- Se você ainda não tem certeza (confidence < 85), mande uma pergunta que ajude a fechar o cerco.
`;

const CHAT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "Sua resposta amigável ou próxima pergunta." },
    confidence: { type: Type.INTEGER, description: "Nível de prontidão para recomendar (0-100)." }
  },
  required: ["text", "confidence"]
};

const VERDICT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    movie: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        justification: { type: Type.STRING },
        vibe: { type: Type.STRING },
      },
      required: ["title", "justification", "vibe"],
    },
    series: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        justification: { type: Type.STRING },
        vibe: { type: Type.STRING },
      },
      required: ["title", "justification", "vibe"],
    },
  },
  required: ["movie", "series"],
};

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API Key is missing");
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  async getChatResponse(history: Message[]): Promise<ChatResponse> {
    try {
      const client = this.getClient();
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: CHAT_SCHEMA,
        },
      });

      try {
        return JSON.parse(response.text || '{}') as ChatResponse;
      } catch (e) {
        return { text: "Foi mal, meu cérebro deu um glitch. Repete aí?", confidence: 30 };
      }
    } catch (e) {
      console.error("Gemini Error:", e);
      return { text: "Erro na conexão com a IA. Verifique a chave de API.", confidence: 0 };
    }
  }

  async getVerdict(history: Message[]): Promise<Verdict> {
    try {
      const client = this.getClient();
      const prompt = `Beleza, atingi a confiança necessária. Com base no papo, escolhe 1 filme e 1 série que vão explodir a cabeça do usuário.
      Histórico: ${history.map(m => `${m.role}: ${m.text}`).join('\n')}`;

      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: VERDICT_SCHEMA,
        },
      });

      return JSON.parse(response.text || '{}') as Verdict;
    } catch (e) {
      console.error("Gemini Error:", e);
      throw e;
    }
  }
}
