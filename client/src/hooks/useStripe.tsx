import { useMutation } from "@tanstack/react-query";
import {
  createCustomer,
  createCheckoutSession,
  deleteCustomer,
  updateSubscription,
  updateUserPlan,
} from "../services/apiStripe";

export default function useStripe() {
  const { mutate: createCustomerFn, error: createCustomerFnError } =
    useMutation({
      mutationFn: (prepData: any) => createCustomer(prepData),
    });

  const { mutate: deleteCustomerFn, error: deleteCustomerFnError } =
    useMutation({
      mutationFn: (prepData: any) => deleteCustomer(prepData),
    });

  const { mutate: updateSubscriptionFn, error: updateSubscriptionFnError } =
    useMutation({
      mutationFn: (prepData: any) => updateSubscription(prepData),
    });

  const {
    mutate: createCheckoutSessionFn,
    error: createCheckoutSessionFnError,
  } = useMutation({
    mutationFn: (prepData: any) => createCheckoutSession(prepData),
  });

  const { mutate: updateUserPlanFn, error: updateUserPlanFnError } =
    useMutation({
      mutationFn: ({ userId, plan }: { userId: string; plan: string }) =>
        updateUserPlan(userId, plan),
    });

  return {
    createCustomerFn,
    createCustomerFnError,
    createCheckoutSessionFn,
    createCheckoutSessionFnError,
    deleteCustomerFn,
    deleteCustomerFnError,
    updateSubscriptionFn,
    updateSubscriptionFnError,
    updateUserPlanFn,
    updateUserPlanFnError,
  };
}
