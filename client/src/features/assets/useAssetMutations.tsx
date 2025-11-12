import { useMutation } from "@tanstack/react-query";
import { addAsset } from "../../services/apiAssets";
import { UploadApiResponse } from "cloudinary";
import { useGlobalContext } from "../../context/GlobalContext";

export default function useAssetMutations() {
  const { user } = useGlobalContext();

  const { mutate: addAssetFn, error: addAssetFnError } = useMutation({
    mutationFn: (asset: UploadApiResponse) => addAsset(asset, user?.id!),
    retry: true,
    retryDelay: 10000,
  });

  const { mutate: updateAsset, error: updateAssetError } = useMutation({});
  const { mutate: deleteAsset, error: deleteAssetError } = useMutation({});

  return {
    addAssetFn,
    addAssetFnError,
    updateAsset,
    updateAssetError,
    deleteAsset,
    deleteAssetError,
  };
}
