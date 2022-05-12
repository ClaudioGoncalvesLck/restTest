var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");

// GET ALL USERS
router.get("/user", async (req, res, next) => {
  userController.user_index(req, res, next);
});

// CREATE USER
router.post("/user", async (req, res, next) => {
  userController.user_create(req, res, next);
});

// GET USER
router.get("/user/:user_id", async (req, res, next) => {
  userController.user_get(req, res, next);
});

// DELETE USER
router.delete("/user/:user_id", async (req, res, next) => {
  userController.user_delete(req, res, next);
});

// UPDATE
router.patch("/user/:user_id", async (req, res, next) => {
  userController.user_delete(req, res, next);
});

module.exports = router;
