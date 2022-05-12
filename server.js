require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
//ROUTES
const user = require("./routes/user.js");
const product = require("./routes/product.js");
const user_product = require("./routes/user_product.js");
const auth = require("./routes/auth.js");

app.use(express.json());
app.use("/", user);
app.use("/", product);
app.use("/", user_product);
app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
