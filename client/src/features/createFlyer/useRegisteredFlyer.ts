import { useGlobalContext } from "../../context/GlobalContext";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  deleteTemplate,
  saveFlyer,
  removeSavedFlyer,
  getFlyerById,
} from "../../services/apiFlyers";
import { UploadApiResponse } from "cloudinary";
import { useParams } from "react-router-dom";

export default function useRegisteredFlyer() {
  const { selectedPlace, user } = useGlobalContext();

  const { mutate: createFlyer, error: createFlyerError } = useMutation({
    mutationFn: (prepData: DB_Flyer_Create) =>
      createRegisteredFlyer(prepData, selectedPlace!),
  });

  const { mutate: editFlyer, error: editFlyerError } = useMutation({
    mutationFn: ({
      prepData,
      initialAssets,
    }: {
      prepData: DB_Flyer_Create;
      initialAssets?: UploadApiResponse[];
    }) => updateRegisteredFlyer(prepData, selectedPlace!, initialAssets || []),
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
    mutationFn: ({
      prepData,
      initialAssets,
    }: {
      prepData: DB_Template;
      initialAssets?: UploadApiResponse[];
    }) => {
      return updateTemplate(prepData, initialAssets || []);
    },
  });

  const { mutate: createTemplateFn, error: createTemplateError } = useMutation({
    mutationFn: (prepData: DB_Template) => {
      return createTemplate(prepData);
    },
  });

  const { mutate: deleteTemplateFn, error: deleteTemplateFnError } =
    useMutation({
      mutationFn: (prepData: DB_Template) => {
        return deleteTemplate(prepData);
      },
    });

  const { mutate: saveFlyerFn, error: saveFlyerFnError } = useMutation({
    mutationFn: (flyerId: string) => saveFlyer(user?.id!, flyerId),
  });

  const { mutate: removeSavedFlyerFn, error: removeSavedFlyerFnError } =
    useMutation({
      mutationFn: (flyerId: number | string) =>
        removeSavedFlyer(user?.id!, flyerId),
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
    deleteTemplateFn,
    deleteTemplateFnError,
    saveFlyerFn,
    saveFlyerFnError,
    removeSavedFlyerFn,
    removeSavedFlyerFnError,
  };
}
