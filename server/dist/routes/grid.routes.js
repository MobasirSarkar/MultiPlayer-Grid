"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const grid_controller_1 = require("../controllers/grid.controller");
const router = (0, express_1.Router)();
const gridController = new grid_controller_1.GridController();
router.get("/", gridController.getGridState.bind(gridController));
router.get("/player/:sessionId", gridController.getPlayerStatus.bind(gridController));
exports.default = router;
