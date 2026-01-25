import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import {
  DB_Flyers_Create_Unregistered,
  DB_Flyers_Response,
} from "../../interfaces/DB_Flyers";
import {
  createUnregisteredFlyer,
  likeFlyer,
  flagFlyer,
} from "../../services/apiFlyers";

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

  // flag flyer
  const { mutate: flagFlyerFn, error: flagFlyerFnError } = useMutation({
    mutationFn: ({
      flyer,
      reason,
      userId,
      placeName,
    }: {
      flyer: DB_Flyers_Response;
      reason: string;
      userId: string | null;
      placeName: string;
    }) => flagFlyer({ flyer, reason, placeName, userId }),
  });
  return {
    createFlyer,
    createFlyerError,
    likeFlyerFn,
    likeFlyerFnError,
    flagFlyerFn,
    flagFlyerFnError,
  };
}
