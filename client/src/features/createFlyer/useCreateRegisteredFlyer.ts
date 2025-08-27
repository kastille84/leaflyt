import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import { DB_Flyer_Create, DB_Template } from "../../interfaces/DB_Flyers";
import {
  createRegisteredFlyer,
  createFlyerFromTemplate,
} from "../../services/apiFlyers";

export default function useCreateRegisteredFlyer() {
  const { selectedPlace, user } = useGlobalContext();

  const { mutate: createFlyer, error: createFlyerError } = useMutation({
    mutationFn: (prepData: DB_Flyer_Create) =>
      createRegisteredFlyer(prepData, selectedPlace!),
  });

  const {
    mutate: createFlyerUsingTemplate,
    error: createFlyerUsingTemplateError,
  } = useMutation({
    mutationFn: (prepData: DB_Template) =>
      createFlyerFromTemplate(prepData, selectedPlace!, user!),
  });

  return {
    createFlyer,
    createFlyerError,
    createFlyerUsingTemplate,
    createFlyerUsingTemplateError,
  };
}
