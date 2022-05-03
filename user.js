const db = require("./db.js");

// INDEX
async function getUsers() {
  try {
    const result = await db.any("SELECT * FROM users");
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

// CREATE USER
async function createUser(user) {
  try {
    const result = await db.any(
      "INSERT INTO users(name) VALUES(${name}) returning *",
      user
    );
    return { message: "Created user", result };
  } catch (error) {
    throw new Error(error);
  }
}

// GET USER BY ID
async function getUserByID(user_id) {
  try {
    {
      const result = await db.one(
        "SELECT * FROM users WHERE user_id=$1",
        user_id
      );
      return result;
    }
  } catch (error) {
    return { message: error.message };
  }
}

// UPDATE USER
async function updateUser(user_id, userInfo) {
  const { name } = userInfo;
  try {
    {
      const result = await db.one(
        "UPDATE users SET name = $1 WHERE user_id = $2 returning *",
        [name, user_id]
      );
      return result;
    }
  } catch (error) {
    return { message: error.message };
  }
}

// DELETE USER
async function deleteUser(user_id) {
  try {
    {
      const result = await db.none("DELETE FROM users WHERE id=$1", user_id);
      return result;
    }
  } catch (error) {
    return { message: error.message };
  }
}

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserByID,
};
