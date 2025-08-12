import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import { DB_Flyer_Create } from "../../interfaces/DB_Flyers";
import { createRegisteredFlyer } from "../../services/apiFlyers";

export default function useCreateRegisteredFlyer() {
  const { selectedPlace } = useGlobalContext();

  const { mutate: createFlyer, error: createFlyerError } = useMutation({
    mutationFn: (prepData: DB_Flyer_Create) =>
      createRegisteredFlyer(prepData, selectedPlace!),
  });

  return { createFlyer, createFlyerError };
}
