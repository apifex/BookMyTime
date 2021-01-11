"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const checkCalendar_1 = require("./checkCalendar");
const PORT = process.env.PORT || 5000;
const server = express_1.default();
server.use(express_1.default.json());
server.use(cors_1.default());
server.post('/checkcalendar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const daysInMonth = yield checkCalendar_1.checkCalendar(req.body);
        res.send(daysInMonth);
    }
    catch (error) {
        console.log("error on checkcalendar: ", error);
    }
}));
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
