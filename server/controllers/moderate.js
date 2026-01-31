const { supabase } = require("../../supabase");
const { openai } = require("../../moderate");
const { handleCatchError } = require("../utility/error");

// exports.deleteAssets = async (req, res, next) => {
//   try {
//     // get assets from the req headers
//     const assets = JSON.parse(req.headers.assets);
//     const userId = Number(JSON.parse(req.headers.user));

//     // delete assets from supabase
//     for (const asset of assets) {
//       const { data, error } = await supabase.rpc("delete_asset_by_public_id", {
//         p_public_id: asset.public_id,
//       });
//       if (error) throw error;
//       // cloudinary delete asset
//       await cloudinary.uploader.destroy(asset.public_id);
//     }
//     return res.status(200).json({ data: assets });
//   } catch (err) {
//     handleCatchError(next, err);
//   }
// };

exports.postModerate = async (req, res, next) => {
  // get inputs from req body
  const { message, fileUrls } = req.body;
  console.log("message", message);
  console.log("fileUrls", fileUrls);
  let response;

  const filePromises = [];
  const inputObj = [
    {
      type: "text",
      text: message,
    },
  ];
  if (fileUrls) {
    inputObj.push(...fileUrls);
  }
  try {
    const response = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: inputObj,
    });

    // filePromises.push(
    //   openai.moderations.create({
    //     model: "omni-moderation-latest",
    //     input: [
    //       {
    //         type: "text",
    //         text: message,
    //       },
    //       ...fileUrls,
    //     ],
    //   })
    // );

    // fileUrls.forEach((file) => {
    //   filePromises.push(
    //     openai.moderations.create({
    //       model: "omni-moderation-latest",
    //       input: [...file],
    //     })
    //   );
    // });

    // const responses = await Promise.all(filePromises);

    return res.status(200).json({ data: response });
  } catch (err) {
    handleCatchError(next, err);
  }
};
