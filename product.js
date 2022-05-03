const db = require("./db.js");

// INDEX
async function getProducts() {
  try {
    const result = await db.any("SELECT * FROM products");
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

// CREATE product
async function createProduct(product) {
  try {
    const result = await db.one(
      "INSERT INTO products(name, amount) VALUES(${name}, ${amount}) returning *",
      product
    );
    return { message: "Created product", result };
  } catch (error) {
    throw new Error(error);
  }
}

// GET product BY ID
async function getProductByID(product_id) {
  try {
    {
      const result = await db.one(
        "SELECT * FROM products WHERE product_id=$1",
        product_id
      );
      return result;
    }
  } catch (error) {
    return { message: error.message };
  }
}

// UPDATE product
async function updateProduct(product_id, productInfo) {
  const { name, amount } = productInfo;
  try {
    {
      const result = await db.one(
        "UPDATE products SET name = $1, amount = $2 WHERE product_id = $3 returning *",
        [name, amount, product_id]
      );
      return result;
    }
  } catch (error) {
    return { message: error.message };
  }
}

// DELETE product
async function deleteProduct(product_id) {
  try {
    {
      const result = await db.none(
        "DELETE FROM products WHERE product_id=$1",
        product_id
      );
      return result;
    }
  } catch (error) {
    return { message: error.message };
  }
}

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductByID,
};
