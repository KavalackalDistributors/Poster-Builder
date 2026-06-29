export type PosterStyle = 'modern' | 'bold' | 'minimal' | 'luxury' | 'playful';
export type PosterLayout = 'centered' | 'left-aligned' | 'split';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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

export const emptyPoster: PosterDesign = {
  headline: 'Your Big Idea',
  tagline: 'Designed beautifully with AI',
  description: 'Tell PosterAI about your product, campaign, colors, and vibe to generate a polished poster instantly.',
  cta: 'Start Creating',
  backgroundColor: '#f8fafc',
  accentColor: '#6366f1',
  textColor: '#111827',
  style: 'modern',
  layout: 'centered',
};
