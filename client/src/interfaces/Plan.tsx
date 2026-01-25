export interface Plan {
  id: number;
  name: string;
  level: number;
  price: number;
  lifespan: number;
  subtitle: string;
  created_at: string;
  numOfMedia: number;
  hasAnalytics: null | "lite" | "full" | string;
  templateLimit: number;
  hasBulkPosting: boolean;
  priceDescription: string;
  remotePostingLimit: number;
  onLocationPostingLimit: number;
  virtualPostingDistance: number | null;
  maxAssets: number;
  stripeProductId: string | null;
}
