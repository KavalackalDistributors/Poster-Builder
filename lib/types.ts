export type PosterStyle = 'modern' | 'bold' | 'minimal' | 'luxury' | 'playful';
export type PosterLayout = 'centered' | 'left-aligned' | 'split';
export type PosterSize = 'portrait' | 'landscape' | 'square';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  poster?: PosterDesign;
  images?: UploadedImage[];
}

export interface UploadedImage {
  id: string;
  src: string;
  name: string;
}

export interface PosterDesign {
  headline: string;
  tagline: string;
  description: string;
  cta: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  style: PosterStyle;
  layout: PosterLayout;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  posterState: PosterDesign;
  images: UploadedImage[];
  createdAt: string;
  updatedAt: string;
}

export const emptyPoster: PosterDesign = {
  headline: 'Your Big Idea',
  tagline: 'Designed beautifully with AI',
  description: 'Tell PosterAI about your product, campaign, colors, and vibe to generate a polished poster instantly.',
  cta: 'Start Creating',
  backgroundColor: '#0f172a',
  accentColor: '#4285f4',
  textColor: '#ffffff',
  style: 'modern',
  layout: 'centered',
};
