import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import { DB_Flyers_Create_Unregistered } from "../../interfaces/DB_Flyers";
import { createUnregisteredFlyer } from "../../services/apiFlyers";

export default function useCreateUnregisteredFlyer() {
  const { selectedPlace } = useGlobalContext();

  const { mutate: createFlyer } = useMutation({
    mutationFn: (prepData: DB_Flyers_Create_Unregistered) =>
      createUnregisteredFlyer(prepData, selectedPlace!),
  });

  return { createFlyer };
}
