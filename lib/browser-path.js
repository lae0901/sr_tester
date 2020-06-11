"use strict";
// ------------------------- path_getFileName ------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.path_getFileName = void 0;
const main_1 = require("./main");
// return the part of the path that follows the last "/" in the string.
function path_getFileName(path) {
    let fileName = path;
    const fx = main_1.scan_revCharEqAny(path, path.length - 1, '\\/');
    // let fx = path.lastIndexOf('/');
    const bx = fx + 1;
    if ((bx > 0) && (bx < path.length)) {
        fileName = path.substr(bx);
    }
    return fileName;
}
exports.path_getFileName = path_getFileName;
