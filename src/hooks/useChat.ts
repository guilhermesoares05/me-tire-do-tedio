import { useState, useEffect, useCallback } from 'react';
import { GeminiService } from '@/services/geminiService';
import { Message, Verdict, AppStatus } from '@/types';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';

const gemini = new GeminiService();

export const useChat = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isTyping, setIsTyping] = useState(false);
  const [confidence, setConfidence] = useState(25);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const saveVerdict = async (v: Verdict) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, `users/${userId}/history`), {
        ...v,
        createdAt: Timestamp.now()
      });
    } catch (e) {
      console.error("Error saving verdict: ", e);
    }
  };

  const resetChat = useCallback(() => {
    setVerdict(null);
    setConfidence(25);
    setMessages([
      { role: 'model', text: 'E aí! Sou seu guia oficial pra sair desse tédio. Pra gente começar: você tá numa vibe de querer explodir a cabeça com algo louco ou só quer relaxar e esquecer os boletos?' }
    ]);
    setStatus(AppStatus.CHATTING);
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (userId) {
      resetChat();
    }
  }, [userId, resetChat]);

  const sendMessage = async () => {
    if (!inputText.trim() || status !== AppStatus.CHATTING || isTyping) return;

    const userMessage: Message = { role: 'user', text: inputText };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await gemini.getChatResponse(newHistory);
      setConfidence(response.confidence);

      const updatedHistory = [...newHistory, { role: 'model', text: response.text } as Message];
      setMessages(updatedHistory);

      if (response.confidence >= 85) {
        setIsTyping(true);
        setStatus(AppStatus.ANALYZING);
        const finalVerdict = await gemini.getVerdict(updatedHistory);
        setVerdict(finalVerdict);
        setStatus(AppStatus.FINISHED);
        await saveVerdict(finalVerdict);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Ih, deu ruim na conexão. Tenta de novo?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    status,
    setStatus,
    isTyping,
    confidence,
    verdict,
    sendMessage,
    resetChat
  };
};
