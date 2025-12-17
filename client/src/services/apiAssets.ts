import { UploadApiResponse } from "cloudinary";
import { getBaseUrl } from "../utils/ServiceUtils";
import { supabase } from "./supabase";
import { getLatestUserAfterChanges } from "./apiFlyers";

export const addAsset = async (asset: any, id: string) => {
  try {
    const { data, error } = await supabase
      .from("assets")
      .insert([{ asset_info: asset, user: id }])
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteAssets = async (assets: UploadApiResponse[], id: string) => {
  // #TODO:
  //  api call to delete assets
  try {
    const response = await fetch(`${getBaseUrl()}/api/assets/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        assets: JSON.stringify(assets),
        user: JSON.stringify(id),
      },
    });
    const result = await response.json();
    console.log("result", result);
    return await getLatestUserAfterChanges(id, "asset");
  } catch (error) {}
};

export async function assetUsageByFlyer(
  initialAssets: UploadApiResponse[],
  proposedAssets: UploadApiResponse[],
  providedFlyerId: string
) {
  // find the delta from the initalAssets and the new Assets and place them in a 'to_delete' and 'to_add' arrays
  const to_delete: UploadApiResponse[] = [];
  const to_add: UploadApiResponse[] = [];

  proposedAssets.forEach((pAsset) => {
    if (
      // if in initial, i can't find a proposed, then add it
      !initialAssets.find((iAsset) => iAsset.public_id === pAsset.public_id)
    ) {
      to_add.push(pAsset);
    }
  });

  initialAssets.forEach((iAsset) => {
    if (
      // if in proposed, i can't find an initial, then add it
      !proposedAssets.find((pAsset) => pAsset.public_id === iAsset.public_id)
    ) {
      to_delete.push(iAsset);
    }
  });
  try {
    // 1. loop through all the assets to be deleted
    for (const asset of to_delete) {
      // 1.1 find the asset in the assets table by looking in the asset_info column and finding by asset_id
      const { data: foundAsset, error } = await supabase.rpc(
        "find_asset_by_public_id",
        {
          asset_public_id: asset.public_id,
        }
      );
      if (error) throw error;
      // 1.2 in the assets's 'used_by_flyers' column, remove the flyer_id
      const used_by_flyers = foundAsset.used_by_flyers.filter(
        (usedByflyerId: string) => usedByflyerId !== providedFlyerId
      );
      // 1.3 update the asset
      const { data, error: updateError } = await supabase
        .from("assets")
        .update({ used_by_flyers })
        .eq("id", foundAsset.id);
      if (updateError) throw updateError;
    }
    // 2. loop through all the assets to be added
    for (const asset of to_add) {
      // 2.1 find the asset in the assets table by looking in the asset_info column and finding by asset_id
      const { data: foundAsset, error } = await supabase.rpc(
        "find_asset_by_public_id",
        {
          asset_public_id: asset.public_id,
        }
      );
      if (error) throw error;
      // 2.2 in the assets's 'used_by_flyers' column, add the flyer_id
      const used_by_flyers = foundAsset.used_by_flyers;
      used_by_flyers.push(providedFlyerId);
      // 2.3 update the asset
      const { data, error: updateError } = await supabase
        .from("assets")
        .update({ used_by_flyers })
        .eq("id", foundAsset.id);
      if (updateError) throw updateError;
    }
  } catch (error: any) {
    console.error(error);
    throw new Error("Error adding the flyer to assets: " + error.message);
  }
}
export async function assetUsageByTemplate(
  initialAssets: UploadApiResponse[],
  proposedAssets: UploadApiResponse[],
  providedTemplateId: string
) {
  // find the delta from the initalAssets and the new Assets and place them in a 'to_delete' and 'to_add' arrays
  const to_delete: UploadApiResponse[] = [];
  const to_add: UploadApiResponse[] = [];

  proposedAssets.forEach((pAsset) => {
    if (
      // if in initial, i can't find a proposed, then add it
      !initialAssets.find((iAsset) => iAsset.public_id === pAsset.public_id)
    ) {
      to_add.push(pAsset);
    }
  });

  initialAssets.forEach((iAsset) => {
    if (
      // if in proposed, i can't find an initial, then add it
      !proposedAssets.find((pAsset) => pAsset.public_id === iAsset.public_id)
    ) {
      to_delete.push(iAsset);
    }
  });
  try {
    // 1. loop through all the assets to be deleted
    for (const asset of to_delete) {
      // 1.1 find the asset in the assets table by looking in the asset_info column and finding by asset_id
      const { data: foundAsset, error } = await supabase.rpc(
        "find_asset_by_public_id",
        {
          asset_public_id: asset.public_id,
        }
      );
      if (error) throw error;
      // 1.2 in the assets's 'used_by_templates' column, remove the flyer_id
      const used_by_templates = foundAsset.used_by_templates.filter(
        (usedByflyerId: string) => usedByflyerId !== providedTemplateId
      );
      // 1.3 update the asset
      const { data, error: updateError } = await supabase
        .from("assets")
        .update({ used_by_templates })
        .eq("id", foundAsset.id);
      if (updateError) throw updateError;
    }
    // 2. loop through all the assets to be added
    for (const asset of to_add) {
      // 2.1 find the asset in the assets table by looking in the asset_info column and finding by asset_id
      const { data: foundAsset, error } = await supabase.rpc(
        "find_asset_by_public_id",
        {
          asset_public_id: asset.public_id,
        }
      );
      if (error) throw error;
      // 2.2 in the assets's 'used_by_templates' column, add the flyer_id
      const used_by_templates = foundAsset.used_by_templates;
      used_by_templates.push(providedTemplateId);
      // 2.3 update the asset
      const { data, error: updateError } = await supabase
        .from("assets")
        .update({ used_by_templates })
        .eq("id", foundAsset.id);
      if (updateError) throw updateError;
    }
  } catch (error: any) {
    console.error(error);
    throw new Error("Error adding the flyer to assets: " + error.message);
  }
}
