const { supabase } = require("../../supabase");
const { handleCatchError } = require("../utility/error");

exports.deleteAssets = async (req, res, next) => {
  try {
    // get assets from the req headers
    const assets = JSON.parse(req.headers.assets);
    const userId = Number(JSON.parse(req.headers.user));

    //  loop through all flyers and delete assets based on asset_id
    const { data, error } = await supabase
      .from("flyers")
      .delete()
      .match({ user: userId });
    if (error) throw error;
    // loop through all templates and delete assets based on asset_id
    // find the asset in the assets table by looking in the asset_info column and finding by asset_id and deleting

    // const { data, error } = await supabase
    //   .from("assets")
    //   .delete()
    //   .match({ id: req.body.id });
    // if (error) throw error;
    return res.status(200).json({ data: assets });
  } catch (err) {
    handleCatchError(next, err);
  }
};
