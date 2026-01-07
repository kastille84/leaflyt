import { useQuery } from "@tanstack/react-query";
import { getPlans } from "../services/apiPlans";
export default function useGetPlans() {
  const {
    isLoading,
    data: plans,
    error,
  } = useQuery({
    queryKey: ["getPlans"],
    queryFn: () => getPlans(),
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });

  return { isLoading, plans, error };
}
