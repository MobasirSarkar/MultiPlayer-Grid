"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_controller_1 = require("../controllers/history.controller");
const router = (0, express_1.Router)();
const historyController = new history_controller_1.HistoryController();
router.get("/", historyController.getHistory.bind(historyController));
router.get("/stats", historyController.getHistoryStats.bind(historyController));
exports.default = router;
