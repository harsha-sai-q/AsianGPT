import type { Message } from 'ai';

export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};
