const express = require("express");
const { checkForId } = require("../controllers/room");

const router = express.Router();

router.post("/checkId", checkForId);

module.exports = router;
