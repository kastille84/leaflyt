// const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { supabase } = require("../../supabase");

const { handleCatchError } = require("../utility/error");

exports.signup = async (req, res, next) => {
  // const errors = validationResult(req);
  try {
    // handleValidationError(errors);

    //  create user profile in supabase
    const newUser = {
      ...req.body,
      plan: 1,
      // analyticsId: 1 default to low analytics
    };
    console.log("newUser", newUser);
    const { data, error } = await supabase
      .from("profiles")
      .insert([newUser])
      .select()
      .single();
    console.log("data", data);
    if (error) throw error;

    return res.status(201).json({ data: data }); // data;
  } catch (err) {
    console.log("error", err);
    handleCatchError(next, err);
  }
};

exports.login = async (req, res, next) => {};
