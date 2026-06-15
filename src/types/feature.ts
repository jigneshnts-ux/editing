export type FeatureStatus = 'working' | 'beta' | 'future';
export type FeatureMode = 'simple' | 'advanced' | 'both';

export type Feature = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: FeatureStatus;
  mode: FeatureMode;
  keywords: string[];
  uiLocation: string;
};
