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
