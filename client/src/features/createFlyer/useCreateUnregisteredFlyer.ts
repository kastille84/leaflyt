import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import {
  DB_Flyers_Create_Unregistered,
  DB_Flyers_Response,
} from "../../interfaces/DB_Flyers";
import { createUnregisteredFlyer, likeFlyer } from "../../services/apiFlyers";

export default function useCreateUnregisteredFlyer() {
  const { selectedPlace } = useGlobalContext();

  const { mutate: createFlyer, error: createFlyerError } = useMutation({
    mutationFn: (prepData: DB_Flyers_Create_Unregistered) =>
      createUnregisteredFlyer(prepData, selectedPlace!),
  });

  // like flyer
  const { mutate: likeFlyerFn, error: likeFlyerFnError } = useMutation({
    mutationFn: ({
      flyer,
      type,
    }: {
      flyer: DB_Flyers_Response;
      type: "inc" | "dec";
    }) => likeFlyer(flyer, type),
  });

  return { createFlyer, createFlyerError, likeFlyerFn, likeFlyerFnError };
}
