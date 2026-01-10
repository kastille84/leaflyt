import { useMutation } from "@tanstack/react-query";
import { createCustomer, createCheckoutSession } from "../services/apiStripe";

export default function useStripe() {
  const { mutate: createCustomerFn, error: createCustomerFnError } =
    useMutation({
      mutationFn: (prepData: any) => createCustomer(prepData),
    });

  const {
    mutate: createCheckoutSessionFn,
    error: createCheckoutSessionFnError,
  } = useMutation({
    mutationFn: (prepData: any) => createCheckoutSession(prepData),
  });
  return {
    createCustomerFn,
    createCustomerFnError,
    createCheckoutSessionFn,
    createCheckoutSessionFnError,
  };
}
