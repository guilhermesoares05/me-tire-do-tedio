import { Timestamp } from 'firebase/firestore';

export interface Message {
  id?: string;
  role: 'user' | 'model';
  text: string;
}

export interface ChatResponse {
  text: string;
  confidence: number;
}

export interface Recommendation {
  title: string;
  justification: string;
  vibe: string;
}

export interface Verdict {
  id?: string;
  movie: Recommendation;
  series: Recommendation;
  createdAt?: Timestamp;
}

export enum AppStatus {
  IDLE = 'IDLE',
  CHATTING = 'CHATTING',
  ANALYZING = 'ANALYZING',
  FINISHED = 'FINISHED',
  HISTORY = 'HISTORY'
}
