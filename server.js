const express = require("express");
const app = express();
const port = 3000;

//TIRAR ISTO DAQUI
const config = require("./db/knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(config);

const user = require("./routes/user.js");

app.use("/user", user);
//PRODUCT ROUTES
app.get("/product", (req, res) => {
  knex
    .select()
    .table("products")
    .then((result) => {
      res.send(result);
    });
});
app.post("/product", (req, res) => {
  const product = req.query;
  if (!product.amount) {
    product.amount = 0;
  }
  knex("products")
    .insert(product)
    .returning("*")
    .then((result) => {
      res.status(201).send({ message: "Product created", result });
    })
    .catch((error) => {
      throw new Error(error);
    });
});
app.get("/product/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  knex("products")
    .where({ id: product_id })
    .select()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});
app.delete("/product/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  knex("products")
    .where({ id: product_id })
    .del()
    .returning("*")
    .then((result) => {
      res.status(200).send({ message: "Product deleted", result });
    });
});
app.patch("/product/:product_id", (req, res) => {
  const productinfo = req.query;
  const product_id = req.params.product_id;
  knex("products")
    .where({ id: product_id })
    .update(productinfo)
    .returning("*")
    .then((result) => {
      res.status(200).send({ message: "Product updated", result });
    });
});

// USER ROUTES
// app.get("/user", (req, res) => {
//   knex
//     .select()
//     .table("users")
//     .then((result) => {
//       res.send(result);
//     });
// });
// app.post("/user", (req, res) => {
//   const user = req.query;
//   knex("users")
//     .insert(user)
//     .returning("*")
//     .then((result) => {
//       res.status(201).send({ message: "User created", result });
//     })
//     .catch((error) => {
//       throw new Error(error);
//     });
// });
// app.get("/user/:user_id", (req, res) => {
//   const user_id = req.params.user_id;
//   knex("users")
//     .where({ id: user_id })
//     .select()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((error) => {
//       throw new Error(error);
//     });
// });
// app.delete("/user/:user_id", (req, res) => {
//   const user_id = req.params.user_id;
//   knex("users")
//     .where({ id: user_id })
//     .del()
//     .returning("*")
//     .then((result) => {
//       res.status(200).send({ message: "User deleted", result });
//     });
// });
// app.patch("/user/:user_id", (req, res) => {
//   const userinfo = req.query;
//   const user_id = req.params.user_id;
//   knex("users")
//     .where({ id: user_id })
//     .update(userinfo)
//     .returning("*")
//     .then((result) => {
//       res.status(200).send({ message: "User updated", result });
//     });
// });

// RELATION ROUTES
app.post("/user/:user_id/product/:product_id", (req, res) => {
  knex("user_product")
    .insert(req.params)
    .returning("*")
    .then((result) => {
      res.send(result);
    });
});
app.get("/user/:user_id/products", (req, res) => {
  const user_id = req.params.user_id;
  knex("user_product")
    .where({ user_id: user_id })
    .select("product_id")
    .then((result) => {
      //devolve um array de objetos
      res.send({ user_id: user_id, result });
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
