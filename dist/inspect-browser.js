"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = __importStar(require("util"));
const spok_1 = __importDefault(require("./spok"));
// terminal colors won't show properly in the browser
spok_1.default.color = false;
function inspect(obj, color) {
    return util.inspect(obj, false, 5, color);
}
exports.default = inspect;
//# sourceMappingURL=inspect-browser.js.map