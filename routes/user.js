var express = require("express");
var router = express.Router();

//TIRAR ISTO DAQUI
const config = require("../db/knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(config);

router.get("/", (req, res) => {
  knex
    .select()
    .table("users")
    .then((result) => {
      res.send(result);
    });
});
router.post("/", (req, res) => {
  const user = req.query;
  knex("users")
    .insert(user)
    .returning("*")
    .then((result) => {
      res.status(201).send({ message: "User created", result });
    })
    .catch((error) => {
      throw new Error(error);
    });
});
router.get("/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  knex("users")
    .where({ id: user_id })
    .select()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});
router.delete("/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  knex("users")
    .where({ id: user_id })
    .del()
    .returning("*")
    .then((result) => {
      res.status(200).send({ message: "User deleted", result });
    });
});
router.patch("/:user_id", (req, res) => {
  const userinfo = req.query;
  const user_id = req.params.user_id;
  knex("users")
    .where({ id: user_id })
    .update(userinfo)
    .returning("*")
    .then((result) => {
      res.status(200).send({ message: "User updated", result });
    });
});

module.exports = router;
