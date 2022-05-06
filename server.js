const express = require("express");
const app = express();
const port = 3000;

//ROUTES
const user = require("./routes/user.js");
const product = require("./routes/product.js");
app.use("/user", user);
app.use("/product", product);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
