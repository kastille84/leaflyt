const { supabase } = require("../../supabase");
const { cloudinary } = require("../../cloudinary");
const { handleCatchError } = require("../utility/error");

exports.deleteAssets = async (req, res, next) => {
  try {
    // get assets from the req headers
    const assets = JSON.parse(req.headers.assets);
    const userId = Number(JSON.parse(req.headers.user));

    // delete assets from supabase
    for (const asset of assets) {
      const { data, error } = await supabase.rpc("delete_asset_by_public_id", {
        p_public_id: asset.public_id,
      });
      if (error) throw error;
      // cloudinary delete asset
      await cloudinary.uploader.destroy(asset.public_id);
    }
    return res.status(200).json({ data: assets });
  } catch (err) {
    handleCatchError(next, err);
  }
};

exports.deleteAllAssetsFromUser = async (req, res, next) => {
  const assetVideos = JSON.parse(req.headers.assetvideos);
  const assetImages = JSON.parse(req.headers.assetimages);

  try {
    if (assetImages.length) {
      console.log("assetImages", assetImages);
      await cloudinary.api
        .delete_resources(assetImages, {
          resource_type: "image",
        })
        .then(() => {
          console.log("here image");
        });
    }
    if (assetVideos.length) {
      console.log("assetVideos", assetVideos);
      await cloudinary.api
        .delete_resources(assetVideos, {
          resource_type: "video",
        })
        .then(() => {});
    }
    return res.status(200).json({ data: null });
  } catch (err) {
    handleCatchError(next, err);
  }
};
