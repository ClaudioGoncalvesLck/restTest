var express = require("express");
var router = express.Router();
const knex = require("../db/knex");

//TIRAR DAQUI
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
      if (Object.keys(result).length === 0) {
        res.status(404).send({ message: "User not found" });
      } else {
        // SEM O ELSE ESTOURA
        res.status(200).send({ message: "User deleted", result });
      }
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

// RELATION ROUTES
router.post("/:user_id/product/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  knex("products")
    .where({ id: product_id })
    .select()
    .returning("*")
    .then((result) => {
      if (Object.keys(result).length === 0) {
        res.status(404).send({ message: "Product not found" });
        res.end();
      } else {
        const product = result;
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
  console.log(product);
  // knex("user_product")
  //   .insert(req.params)
  //   .returning("*")
  //   .then((result) => {
  //     console.log(result);
  //     // res.send(result);
  //   });
});

router.get("/:user_id/products", (req, res) => {
  const user_id = req.params.user_id;
  knex("user_product")
    .where({ user_id: user_id })
    .select("product_id")
    .then((result) => {
      //devolve um array de objetos
      res.send({ user_id: user_id, result });
    });
});

module.exports = router;
