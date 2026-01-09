import { useMutation } from "@tanstack/react-query";
import { createCustomer } from "../services/apiStripe";

export default function useStripe() {
  const { mutate: createCustomerFn, error: createCustomerFnError } =
    useMutation({
      mutationFn: (prepData: any) => createCustomer(prepData),
    });

  return { createCustomerFn, createCustomerFnError };
}
