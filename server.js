const express = require("express");
const app = express();
const port = 3000;

//TIRAR ISTO DAQUI
const config = require("./db/knexfile")[process.env.NODE_ENV || "development"];
const knex = require("knex")(config);

//ROUTES
const user = require("./routes/user.js");
const product = require("./routes/product.js");
app.use("/user", user);
app.use("/product", product);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
