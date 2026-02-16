const dayjs = require("dayjs");
const { supabase } = require("../../supabase");
const { cloudinary } = require("../../cloudinary");
const { handleCatchError } = require("../utility/error");

exports.deleteFlaggedFlyers = async (req, res, next) => {
  try {
    const flyersToDelete = [];
    const unregisteredFlyerFilesToDelete = [];
    // select all flagged flyers that are older than 7 days
    const { data, error } = await supabase
      .from("flyers")
      .select("*")
      .eq("flagged", true)
      // expires_at < now()
      // .lt("flagged_at", dayjs().format("YYYY-MM-DD HH:mm:ssZZ"));
      // reads as "created_at < now() - 7 days"
      .lt(
        "flagged_at",
        dayjs().subtract(7, "day").format("YYYY-MM-DD HH:mm:ssZZ"),
      );
    // .lt("created_at", dayjs().subtract(1, "month").format("YYYY-MM-DD"));
    // .lt("created_at", dayjs().subtract(4, "day").format("YYYY-MM-DD"));
    if (error) throw error;

    data.forEach((flyer) => {
      if (!flyer.user) {
        // unregistered flyer
        unregisteredFlyerFilesToDelete.push({ ...flyer.fileUrlArr[0] });
      }
      flyersToDelete.push(flyer.id);
    });

    // delete files from cloudinary
    if (unregisteredFlyerFilesToDelete.length > 0) {
      unregisteredFlyerFilesToDelete.forEach(async (file) => {
        await cloudinary.uploader.destroy(file.public_id);
      });
    }

    const { data: deleteCountData, error: deleteError } = await supabase.rpc(
      "delete_flyers_by_ids",
      {
        ids: flyersToDelete,
      },
    );
    if (deleteError) throw deleteError;
    return deleteCountData;
  } catch (err) {
    console.log("error", err);
  }
};

exports.deleteExpiredFlyers = async (req, res, next) => {
  try {
    const flyersToDelete = [];
    const unregisteredFlyerFilesToDelete = [];
    const { data, error } = await supabase
      .from("flyers")
      .select("*")
      // expires_at < now()
      .lt("expires_at", dayjs().format("YYYY-MM-DD HH:mm:ssZZ"));
    // .lt("expires_at", dayjs().subtract(10, "days").format("YYYY-MM-DD"));

    data.forEach((flyer) => {
      if (!flyer.user && flyer.fileUrlArr.length > 0) {
        // unregistered flyer
        unregisteredFlyerFilesToDelete.push({ ...flyer.fileUrlArr[0] });
      }
      flyersToDelete.push(flyer.id);
    });

    // delete files from cloudinary
    if (unregisteredFlyerFilesToDelete.length > 0) {
      unregisteredFlyerFilesToDelete.forEach(async (file) => {
        await cloudinary.uploader.destroy(file.public_id);
      });
    }

    if (error) throw error;
    const { data: deleteCountData, error: deleteError } = await supabase.rpc(
      "delete_flyers_by_ids",
      {
        ids: flyersToDelete,
      },
    );
    return data;
  } catch (err) {
    console.log("error", err);
  }
};

exports.deleteUnregisteredFlyers = async (req, res, next) => {
  try {
    const flyersToDelete = [];
    const unregisteredFlyerFilesToDelete = [];
    const { data, error } = await supabase
      .from("flyers")
      .select("*")
      .is("user", null)
      .lt("expires_at", dayjs().format("YYYY-MM-DD HH:mm:ssZZ"));
    if (error) throw error;
    console.log("data", data);
    data.forEach((flyer) => {
      if (flyer.fileUrlArr.length > 0)
        unregisteredFlyerFilesToDelete.push({ ...flyer.fileUrlArr[0] });
      flyersToDelete.push(flyer.id);
    });

    // delete files from cloudinary
    if (unregisteredFlyerFilesToDelete.length > 0) {
      unregisteredFlyerFilesToDelete.forEach(async (file) => {
        await cloudinary.uploader.destroy(file.public_id);
      });
    }

    const { data: deleteCountData, error: deleteError } = await supabase.rpc(
      "delete_flyers_by_ids",
      {
        ids: flyersToDelete,
      },
    );
    return data;
  } catch (err) {
    console.log("error", err);
  }
};
