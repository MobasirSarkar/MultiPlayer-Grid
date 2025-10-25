"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const common_controller_1 = require("../controllers/common.controller");
const commonRouter = (0, express_1.Router)();
commonRouter.get("/health", common_controller_1.HealthController);
exports.default = commonRouter;
