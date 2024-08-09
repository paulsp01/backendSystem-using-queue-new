const express = require("express");
const { enqueueRequest } = require("../controllers/queueController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/enqueue", authMiddleware, enqueueRequest);

module.exports = router;
