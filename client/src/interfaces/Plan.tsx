export interface Plan {
  id: number;
  name: string;
  level: number;
  price: number;
  lifespan: number;
  subtitle: string;
  created_at: string;
  numOfMedia: number;
  hasAnalytics: boolean;
  templateLimit: number;
  hasBulkPosting: boolean;
  priceDescription: string;
  remotePostingLimit: number;
  onLocationPostingLimit: number;
  virtualPostingDistance: number;
}
