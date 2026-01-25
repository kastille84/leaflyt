import { useMutation } from "@tanstack/react-query";
import {
  addAsset,
  deleteAssets,
  deleteAllAssets,
} from "../../services/apiAssets";
import { UploadApiResponse } from "cloudinary";
import { useGlobalContext } from "../../context/GlobalContext";

export default function useAssetMutations() {
  const { user } = useGlobalContext();

  const { mutate: addAssetFn, error: addAssetFnError } = useMutation({
    mutationFn: (asset: UploadApiResponse) =>
      addAsset(asset, user?.id! as string),
    retry: true,
    retryDelay: 10000,
  });
  const { mutate: deleteAssetsFn, error: deleteAssetsFnError } = useMutation({
    mutationFn: (assets: UploadApiResponse[]) =>
      deleteAssets(assets, user?.id! as string),
    retry: true,
    retryDelay: 10000,
  });

  const {
    mutateAsync: deleteAllAssetsAsync,
    error: deleteAllAssetsAsyncError,
  } = useMutation({
    mutationFn: ({
      assetVideos,
      assetImages,
    }: {
      assetVideos: string[];
      assetImages: string[];
    }) => deleteAllAssets(assetVideos, assetImages),
    retry: true,
    retryDelay: 10000,
  });

  const { mutate: updateAsset, error: updateAssetError } = useMutation({});

  return {
    addAssetFn,
    addAssetFnError,
    updateAsset,
    updateAssetError,
    deleteAssetsFn,
    deleteAssetsFnError,
    deleteAllAssetsAsync,
    deleteAllAssetsAsyncError,
  };
}
