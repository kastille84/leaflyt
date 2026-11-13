import { useMutation } from "@tanstack/react-query";
import {
  createCustomer,
  createCheckoutSession,
  deleteCustomer,
  updateSubscription,
  // cancelSubscription,
  updateUserPlan,
} from "../services/apiStripe";

export default function useStripe() {
  const { mutate: createCustomerFn, error: createCustomerFnError } =
    useMutation({
      mutationFn: (prepData: any) => createCustomer(prepData),
    });

  // the services swallow failures into { error }, which would count as a
  // success for react-query. Rethrow so onError / rejected promises fire.
  const throwOnError = async (promise: Promise<any>) => {
    const result = await promise;
    if (result?.error) throw result.error;
    return result;
  };

  const { mutate: deleteCustomerFn, error: deleteCustomerFnError } =
    useMutation({
      mutationFn: (prepData: any) => throwOnError(deleteCustomer(prepData)),
    });
  const { mutateAsync: deleteCustomerAsync, error: deleteCustomerAsyncError } =
    useMutation({
      mutationFn: (prepData: any) => throwOnError(deleteCustomer(prepData)),
    });

  const { mutate: updateSubscriptionFn, error: updateSubscriptionFnError } =
    useMutation({
      mutationFn: (prepData: any) =>
        throwOnError(updateSubscription(prepData)),
    });

  // const {
  //   mutateAsync: cancelSubscriptionAsyncFn,
  //   error: cancelSubscriptionAsyncFnError,
  // } = useMutation({
  //   mutationFn: (prepData: any) => cancelSubscription(prepData),
  // });

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
    deleteCustomerAsync,
    deleteCustomerAsyncError,
    updateSubscriptionFn,
    updateSubscriptionFnError,
    // cancelSubscriptionAsyncFn,
    // cancelSubscriptionAsyncFnError,
    updateUserPlanFn,
    updateUserPlanFnError,
  };
}
