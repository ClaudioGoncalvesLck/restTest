const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
//ROUTES
const user = require("./routes/user.js");
const product = require("./routes/product.js");
const auth = require("./routes/auth.js");

app.use(express.json());
app.use("/user", user);
app.use("/product", product);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
