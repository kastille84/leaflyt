import { useGlobalContext } from "../context/GlobalContext";
import { DB_Flyers_Response } from "../interfaces/DB_Flyers";
import { Plan } from "../interfaces/Plan";

const defaultPlan: Plan = {
  id: 0,
  name: "",
  level: 0,
  price: 0,
  lifespan: 1,
  subtitle: "",
  created_at: "",
  numOfMedia: 1,
  hasAnalytics: null,
  templateLimit: 0,
  hasBulkPosting: false,
  priceDescription: "",
  remotePostingLimit: 0,
  onLocationPostingLimit: 10,
  virtualPostingDistance: null,
};

function getPostingAmount(flyers: DB_Flyers_Response[], type: string) {
  return flyers.reduce(
    (acc, flyer) => (flyer.postingMethod === type ? acc + 1 : acc),
    0
  );
}

export default () => {
  const { user } = useGlobalContext();
  const plan = user?.plan || defaultPlan;

  const planLimits = {
    analytics: { isAllowed: !!plan.hasAnalytics, limit: plan.hasAnalytics },
    templates: {
      isAllowed: (user?.templates.length || 0) < plan.templateLimit,
      limit: plan.templateLimit,
    },
    media: { limit: plan.numOfMedia },
    remotePosting: {
      isAllowed:
        (user?.flyers ? getPostingAmount(user.flyers, "remote") : 0) <=
        plan.remotePostingLimit,
      limit: plan.remotePostingLimit,
    },
    onLocationPosting: {
      isAllowed:
        (user?.flyers ? getPostingAmount(user.flyers, "onLocation") : 0) <=
        plan.onLocationPostingLimit,
      limit: plan.onLocationPostingLimit,
    },
    distance: { limit: plan.virtualPostingDistance },
    bulkPosting: { isAllowed: plan.hasBulkPosting },
    design: { isAllowed: plan.level >= 2 },
    mapInteractive: { isAllowed: plan.level >= 2 },
    lifeSpan: { limit: plan.lifespan },
    registered: plan.level >= 1,
    paid: plan.level >= 2,
    name: plan.name,
    canUpgrade: plan.level < 4,
    level: plan.level,
  };

  return planLimits;
};
