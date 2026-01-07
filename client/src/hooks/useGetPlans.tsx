import { useQuery } from "@tanstack/react-query";
import { getPlans } from "../services/apiPlans";
export default function useGetPlans() {
  const { status, data } = useQuery({
    queryKey: ["getPlans"],
    queryFn: () => getPlans(),
  });

  return { status, data };
}
