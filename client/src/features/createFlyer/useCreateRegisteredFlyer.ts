import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation } from "@tanstack/react-query";
import {
  DB_Flyer_Create,
  DB_Flyers_Response,
  DB_Template,
} from "../../interfaces/DB_Flyers";
import {
  createRegisteredFlyer,
  createFlyerFromTemplate,
  updateRegisteredFlyer,
  updateTemplate,
  createTemplate,
  deleteFlyer,
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

  const { mutate: deleteFlyerFn, error: deleteFlyerFnError } = useMutation({
    mutationFn: (prepData: DB_Flyers_Response) => deleteFlyer(prepData),
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

  const { mutate: createTemplateFn, error: createTemplateError } = useMutation({
    mutationFn: (prepData: DB_Template) => {
      return createTemplate(prepData);
    },
  });

  return {
    createFlyer,
    createFlyerError,
    editFlyer,
    editFlyerError,
    deleteFlyerFn,
    deleteFlyerFnError,
    createFlyerUsingTemplate,
    createFlyerUsingTemplateError,
    editTemplate,
    editTemplateError,
    createTemplateFn,
    createTemplateError,
  };
}
