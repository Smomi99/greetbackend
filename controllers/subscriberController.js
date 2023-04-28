const asyncHandler = require("express-async-handler");
const knex = require("../db/db");

// Add subscriber
module.exports.addSubscriber = asyncHandler(async (req, res) => {
  try {
    const { body, user } = req;
    const payload = {
      ...body,
      user_id: user.user_id,
      is_active: 1,
      is_finished: 0,
    };
    const subscriber = await knex("Subscribers").insert(payload);
    if (!subscriber) {
      return res
        .status(400)
        .json({ error: true, message: "Subscriber Add Failed!", data: [] });
    }

    res.json({
      error: false,
      message: "Subscriber Added Successfully",
      data: subscriber,
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

// Get All bugs
module.exports.getSubscriber = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    const bugs = await knex("Subscribers")
      .where({
        is_active: 1,
      })
      .orderBy("id", "desc");
    if (!bugs) {
      return res
        .status(400)
        .json({ error: true, message: "Subscriber Retrive Failed!", data: [] });
    }

    res.json({
      error: false,
      message: "Subscriber Retrive Successfully",
      data: bugs,
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

// Delete subscriber
module.exports.deleteSubscriber = asyncHandler(async (req, res) => {
  try {
    const { params, user } = req;
    if (!params.id) {
      return res
        .status(400)
        .json({ error: true, message: "Subscriber id not provide!", data: [] });
    }
    const subscriber = await knex("Subscribers")
      .update({
        is_active: 0,
      })
      .where({
        id: params.id,
      });
    if (!subscriber) {
      return res
        .status(400)
        .json({ error: true, message: "Subscriber Ddelete Failed!", data: [] });
    }

    res.json({
      error: false,
      message: "Subscriber Delete Successfully",
      data: params.id,
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
