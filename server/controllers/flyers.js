const dayjs = require("dayjs");
const { supabase } = require("../../supabase");
const { handleCatchError } = require("../utility/error");

exports.deleteFlaggedFlyers = async (req, res, next) => {
  try {
    // select all flagged flyers that are older than 7 days
    const { data, error } = await supabase
      .from("flyers")
      .select("*")
      .eq("flagged", true)
      // reads as "created_at < now() - 7 days"
      .lt("flagged_at", dayjs().subtract(7, "day").format("YYYY-MM-DD"));
    // .lt("created_at", dayjs().subtract(1, "month").format("YYYY-MM-DD"));
    // .lt("created_at", dayjs().subtract(4, "day").format("YYYY-MM-DD"));

    const flaggedFlyerIds = data.map((flyer) => {
      return flyer.id;
    });

    console.log("Flagged Flyers", flaggedFlyerIds);
    if (error) throw error;
    const { data: deleteCountData, error: deleteError } = await supabase.rpc(
      "delete_flyers_by_ids",
      {
        ids: flaggedFlyerIds,
      },
    );
    return data;
  } catch (err) {
    console.log("error", err);
  }
};

exports.deleteExpiredFlyers = async (req, res, next) => {
  try {
    // select all flyers that are older than 7 days
    const { data, error } = await supabase
      .from("flyers")
      .select("*")
      // expires_at < now()
      .lt("expires_at", dayjs().format("YYYY-MM-DD"));
    // .lt("expires_at", dayjs().subtract(10, "days").format("YYYY-MM-DD"));
    const flyerIds = data.map((flyer) => {
      return flyer.id;
    });
    console.log("old flyers", flyerIds);
    if (error) throw error;
    const { data: deleteCountData, error: deleteError } = await supabase.rpc(
      "delete_flyers_by_ids",
      {
        ids: flyerIds,
      },
    );
    return data;
  } catch (err) {
    console.log("error", err);
  }
};
