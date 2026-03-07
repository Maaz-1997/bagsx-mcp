"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleToolCall = exports.TOOL_DEFINITIONS = void 0;
var definitions_1 = require("./definitions");
Object.defineProperty(exports, "TOOL_DEFINITIONS", { enumerable: true, get: function () { return definitions_1.TOOL_DEFINITIONS; } });
var handlers_1 = require("./handlers");
Object.defineProperty(exports, "handleToolCall", { enumerable: true, get: function () { return handlers_1.handleToolCall; } });
__exportStar(require("./definitions"), exports);
//# sourceMappingURL=index.js.map