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

export interface FavoriteMovie {
  id?: string;
  title: string;
  genre: string;
  releaseYear: number;
  description?: string;
  createdAt?: Timestamp;
}

export const MOVIE_GENRES = [
  'Ação',
  'Aventura',
  'Comédia',
  'Drama',
  'Ficção Científica',
  'Fantasia',
  'Terror',
  'Romance',
  'Suspense',
  'Documentário',
  'Animação',
  'Musical',
  'Outro'
];

export enum AppStatus {
  IDLE = 'IDLE',
  CHATTING = 'CHATTING',
  ANALYZING = 'ANALYZING',
  FINISHED = 'FINISHED',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE'
}
