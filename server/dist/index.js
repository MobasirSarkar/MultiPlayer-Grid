"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const common_routes_1 = __importDefault(require("./routes/common.routes"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/common", common_routes_1.default);
app.listen(env_1.PORT, () => {
    console.log(`server running at http://localhost:${env_1.PORT}`);
});
