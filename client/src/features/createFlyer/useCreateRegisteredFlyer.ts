import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import { DB_Flyer_Create, DB_Template } from "../../interfaces/DB_Flyers";
import {
  createRegisteredFlyer,
  createFlyerFromTemplate,
  updateRegisteredFlyer,
  updateTemplate,
} from "../../services/apiFlyers";

export default function useCreateRegisteredFlyer() {
  const { selectedPlace, user } = useGlobalContext();

  const { mutate: createFlyer, error: createFlyerError } = useMutation({
    mutationFn: (prepData: DB_Flyer_Create) =>
      createRegisteredFlyer(prepData, selectedPlace!),
  });

  const { mutate: editFlyer, error: editFlyerError } = useMutation({
    mutationFn: (prepData: DB_Flyer_Create) =>
      updateRegisteredFlyer(prepData, selectedPlace!),
  });

  const {
    mutate: createFlyerUsingTemplate,
    error: createFlyerUsingTemplateError,
  } = useMutation({
    mutationFn: (prepData: DB_Template) =>
      createFlyerFromTemplate(prepData, selectedPlace!, user!),
  });

  const { mutate: editTemplate, error: editTemplateError } = useMutation({
    mutationFn: (prepData: DB_Template) => {
      return updateTemplate(prepData);
    },
  });

  return {
    createFlyer,
    createFlyerError,
    editFlyer,
    editFlyerError,
    createFlyerUsingTemplate,
    createFlyerUsingTemplateError,
    editTemplate,
    editTemplateError,
  };
}
