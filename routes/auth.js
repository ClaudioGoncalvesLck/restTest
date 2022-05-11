var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const knex = require("../db/knex");

const { Model, ValidationError } = require("objection");
const { User } = require("../models/User");
Model.knex(knex);

//HELPER FUNCTIONS
const { inputValidationErrorHandler } = require("../utils/helper");
const { user } = require("pg/lib/defaults");

router.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const foundUser = await User.query()
      .select("*")
      .from("users")
      .where("email", "=", email);

    if (foundUser.length !== 0) {
      return res.status(409).send("Email already in use");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const createdUser = await User.query()
      .insert({ name, email, password: encryptedPassword })
      .returning("*");

    // Create token
    const token = jwt.sign(
      { user_id: createdUser.id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    createdUser.token = token;

    // return new user
    res.status(201).send(createdUser);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    const foundUser = await User.query()
      .select("*")
      .from("users")
      .where("email", "=", email);

    if (foundUser.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordMatches = await bcrypt.compareSync(
      password,
      foundUser[0].password
    );

    if (!passwordMatches) {
      return res.status(401).send({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { user_id: foundUser[0].id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    foundUser[0].token = token;
    res.status(200).send(foundUser);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
