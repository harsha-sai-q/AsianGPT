export type Mood = 'disappointed' | 'dramatic' | 'chaotic' | 'judgmental' | 'supportive-after-roast';

export type RoastIntensity = 1 | 2 | 3 | 4 | 5;

export type PersonalityContext = {
  userMessage: string;
  recentFailures?: number;
  conversationLength: number;
  userSentiment?: 'negative' | 'neutral' | 'positive';
};

export type MoodState = {
  mood: Mood;
  intensity: RoastIntensity;
  reactionTag: string;
};
