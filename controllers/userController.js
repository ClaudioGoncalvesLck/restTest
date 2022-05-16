const knex = require("../db/knex");
const { Model, ValidationError, NotFoundError } = require("objection");
const { User } = require("../models/User");
const { inputValidationErrorHandler } = require("../utils/helper");

Model.knex(knex);

exports.user_index = async (req, res, next) => {
  try {
    const foundUsers = await User.query().select(
      "id",
      "name",
      "email",
      "create d_at",
      "updated_at"
    );

    if (foundUsers.length === 0) {
      return res.status(404).send({ message: "Users not found" });
    }

    res.status(200).send(foundUsers);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
    }

    next(error);
  }
};

exports.user_create = async (req, res, next) => {
  const newUserInfo = req.query;

  try {
    const createdUser = await User.query().insert(newUserInfo).returning("*");
    const sendUser = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      created_at: createdUser.created_at,
    };

    res.status(201).send({ message: "User created", user: sendUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
    }

    next(error);
  }
};

exports.user_get = async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const foundUser = await User.query()
      .select("id", "name", "email", "created_at", "updated_at")
      .from("users")
      .where("id", "=", user_id);
    if (foundUser.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User found", foundUser });
  } catch (error) {
    next(error);
  }
};

exports.user_update = async (req, res, next) => {
  const user_id = req.params.user_id;

  try {
    const deletedUser = await User.query()
      .deleteById(user_id)
      .returning("name", "email");

    // returns undefined if user doesn't exist
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User deleted", deletedUser });
  } catch (error) {
    next(error);
  }
};

exports.user_delete = async (req, res, next) => {
  const userInfo = req.query;
  const user_id = req.params.user_id;

  try {
    const updatedUser = await User.query()
      .findById(user_id)
      .patch(userInfo)
      .returning("name", "email");

    // returns undefined if user doesn't exist
    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User updated", updatedUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(inputValidationErrorHandler(error));
    }

    next(error);
  }
};
