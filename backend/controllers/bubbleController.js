const asyncHandler = require("express-async-handler");
const multer = require("multer");
const fs = require("fs");
const { bubbleCode } = require("../helpers/common");
const knex = require("../db/db");
//upload bubble video
const uploadVideo = asyncHandler(async (req, res) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/mov",
    "video/wmv",
    "video/avi",
    "video/mkv",
    "video/webm",
    "video/ogg",
  ];
  const maxVideoSize = 5 * 1024 * 1024; // 5MB
  const user_id = req.user.user_id;
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      const path = `public/files/users/${user_id}/Bubble-Videos/`;
      fs.mkdirSync(path, { recursive: true });
      callback(null, path);
    },
    filename: (req, file, cb) => {
      const path = require("path");
      const filename = `${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      cb(null, filename);
    },
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: maxVideoSize },
    fileFilter: function (req, file, cb) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        const error = new Error(
          `Invalid file type. Only ${allowedMimeTypes.join(
            ", "
          )} files are allowed.`
        );
        error.statusCode = 400;
        return cb(error);
      }
      cb(null, true);
    },
  }).single("video");

  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: "Error uploading video",
        data: null,
      });
    }
    return res.status(201).json({
      error: false,
      message: "Successfully uploaded video",
      data: req.file.filename,
    });
  });
});
//bubble create
const createBubble = asyncHandler(async (req, res) => {
  const payload = generateBubbleCreatePayload(req);
  console.log("payload is ", payload);
  try {
    const result = await knex("Bubbles").insert(payload);
    res.status(201).json({
      error: false,
      message: "successfully bubble created",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Something went wrong!!",
      data: null,
    });
  }
});
//edit bubble video
const editBubble = asyncHandler(async (req, res) => {
  const bubble_id = req.params.id;
  const payload = await generateBubbleUpdatePayload(req, bubble_id);
  try {
    await knex("Bubbles").update(payload).where({
      id: bubble_id,
      is_deleted: 0,
    });
    res.status(201).json({
      error: false,
      message: "successfully bubble updated",
      data: req.params,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Something went wrong!!",
      data: null,
    });
  }
});
//delete bubble video
const deleteBubble = asyncHandler(async (req, res) => {
  const bubble_id = req.params.id;
  try {
    await knex("Bubbles").update({ is_deleted: 1 }).where({
      id: bubble_id,
      is_deleted: 0,
    });
    res.status(201).json({
      error: false,
      message: "successfully bubble deleted",
      data: req.params,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: "Something went wrong!!",
      data: null,
    });
  }
});
//get all bubble for a user
const getAllBubble = asyncHandler(async (req, res) => {
  try {
    const bubbleData = await knex("Bubbles").select().where({
      user_id: req.user.user_id,
      is_deleted: 0,
    });
    res.status(201).json({
      error: false,
      message: "successfully bubble get",
      data: bubbleData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong!!",
      data: null,
    });
  }
});
//get single bubble for a user
const getSingleBubble = asyncHandler(async (req, res) => {
  try {
    const bubbleData = await knex("Bubbles").select().where({
      user_id: req.user.user_id,
      bubble_code: req.params.bubble_code,
      is_deleted: 0,
    });
    res.status(201).json({
      error: false,
      message: "successfully bubble get",
      data: bubbleData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong!!",
      data: null,
    });
  }
});
const getBubbleInfo = asyncHandler(async (req, res) => {
  const { CompleteGreet_ID } = req.body;
  var System = await knex("SystemInfos")
    .select("notification_sound")
    .first()
    .where({ code: "CGSystem" });
  console.log(System);
  try {
    const bubbleData = await knex("Bubbles").select().where({
      bubble_code: CompleteGreet_ID,
      is_deleted: 0,
    });
    // console.log("bubble info ", bubbleData);
    const { bubble_button_config, ...restData } = bubbleData[0];
    const btn = JSON.parse(bubble_button_config);
    const finalReponse = {
      Status: "Success",
      Bubble: {
        ...restData,
        bubble_button_config: btn,
      },
      NotificationSound:
        "/images/CompleteGreet/NotificationSoundFile-1672841469730.wav",
      liveOnBubble: true,
    };
    res.status(201).json({
      error: false,
      status: "success",
      message: "successfully bubble get",
      data: finalReponse,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      status: "error",
      message: "Something went wrong!!",
      data: null,
    });
  }
});
const generateBubbleCreatePayload = (req) => {
  // console.log(req.user)
  const {
    bubble_name,
    bubble_video,
    bubble_gif,
    bubble_font_size,
    bubble_title,
    bubble_size,
    bubble_border_color,
    bubble_background_color,
    bubble_button_color,
    bubble_font_family,
    bubble_darken,
    bubble_style,
    bubble_position,
    bubble_video_fit,
    bubble_delay,
    bubble_animation,
    is_deleted,
    bubble_button_config,
    bubble_all_pages,
    bubble_exc_pages,
    is_complete_greet_button,
    bubble_greet_msg
  } = req.body;
  const payload = {
    bubble_name,
    bubble_video,
    bubble_gif,
    bubble_font_size,
    bubble_title,
    bubble_size,
    bubble_border_color,
    bubble_background_color,
    bubble_button_color,
    bubble_font_family,
    bubble_darken,
    bubble_style,
    bubble_position,
    bubble_video_fit,
    bubble_delay,
    bubble_animation,
    is_deleted,
    bubble_code: bubbleCode(),
    user_id: req.user.user_id,
    bubble_button_config: JSON.stringify(bubble_button_config),
    bubble_all_pages,
    bubble_exc_pages: JSON.stringify(bubble_exc_pages),
    is_complete_greet_button,
    bubble_greet_msg,
  };
  return payload;
};
const generateBubbleUpdatePayload = async (req, bubble_id) => {
  // console.log(req.user)
  const queryResult = await knex("Bubbles").select().first().where({
    id: bubble_id,
    is_deleted: 0,
  });
  const {
    bubble_name,
    bubble_video,
    bubble_gif,
    bubble_font_size,
    bubble_title,
    bubble_size,
    bubble_border_color,
    bubble_background_color,
    bubble_button_color,
    bubble_font_family,
    bubble_darken,
    bubble_style,
    bubble_position,
    bubble_video_fit,
    bubble_delay,
    bubble_animation,
    is_deleted,
  } = req.body;
  const payload = {
    bubble_name: bubble_name || queryResult.bubble_name,
    bubble_video: bubble_video || queryResult.bubble_video,
    bubble_gif: bubble_gif || queryResult.bubble_gif,
    bubble_font_size: bubble_font_size || queryResult.bubble_font_size,
    bubble_title: bubble_title || queryResult.bubble_title,
    bubble_size: bubble_size || queryResult.bubble_size,
    bubble_border_color: bubble_border_color || queryResult.bubble_border_color,
    bubble_background_color:
      bubble_background_color || queryResult.bubble_background_color,
    bubble_button_color: bubble_button_color || queryResult.bubble_button_color,
    bubble_font_family: bubble_font_family || queryResult.bubble_font_family,
    bubble_darken: bubble_darken || queryResult.bubble_darken,
    bubble_style: bubble_style || queryResult.bubble_style,
    bubble_position: bubble_position || queryResult.bubble_position,
    bubble_video_fit: bubble_video_fit || queryResult.bubble_video_fit,
    bubble_delay: bubble_delay || queryResult.bubble_delay,
    bubble_animation: bubble_animation || queryResult.bubble_animation,
  };
  return payload;
};
const deactivatedBubble = asyncHandler(async (req, res) => {
  try {
    const bubbleData = await knex("Bubbles")
      .update({
        deactivated: req.body.deactivated,
      })
      .where({
        user_id: req.user.user_id,
        bubble_code: req.params.bubble_code,
        is_deleted: 0,
      });
    res.status(201).json({
      error: false,
      message: "successfully updated ",
      data: bubbleData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong!!",
      data: null,
    });
  }
});

const bubbleConnect = asyncHandler(async (req, res) => {
  try {
    res.json({ Status: "Success", error: "Bubble not found" });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Something went wrong!!",
      data: null,
    });
  }
});
module.exports = {
  uploadVideo,
  createBubble,
  editBubble,
  deleteBubble,
  getAllBubble,
  getSingleBubble,
  getBubbleInfo,
  deactivatedBubble,
  bubbleConnect,
};
