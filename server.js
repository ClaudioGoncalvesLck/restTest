const express = require("express");
const app = express();
const port = 3000;
const {
  getUsers,
  getUserByID,
  createUser,
  deleteUser,
  updateUser,
} = require("./user.js");

const {
  createProduct,
  getProductByID,
  getProducts,
  updateProduct,
  deleteProduct,
} = require(".//product.js");

//PRODUCT ROUTES
app.get("/products", (req, res) => {
  getProducts()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.post("/product", (req, res) => {
  const product = req.query;
  createProduct(product).then((result) => {
    res.send(result);
  });
});

app.get("/product/:product_id", (req, res) => {
  const product_id = req.params.product_id;
  console.log(product_id);
  getProductByID(product_id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.patch("/product/:product_id", (req, res) => {
  const productinfo = req.query;
  const product_id = req.params.product_id;
  updateProduct(product_id, productinfo)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

// USER ROUTES
app.get("/users", (req, res) => {
  getUsers()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.post("/user", (req, res) => {
  const userInfo = req.query;
  createUser(userInfo)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.get("/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  getUserByID(user_id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.delete("/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;
  deleteUser(user_id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.patch("/user/:user_id", (req, res) => {
  const userinfo = req.query;
  updateUser(user_id, userinfo)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      throw new Error(error);
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
