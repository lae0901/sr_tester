"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.path_getFileName = void 0;
// ------------------------- path_getFileName ------------------------
// return the part of the path that follows the last "/" in the string.
function path_getFileName(path) {
    let fileName = path;
    const fx = path.lastIndexOf('/');
    const bx = fx + 1;
    if ((bx > 0) && (bx < path.length)) {
        fileName = path.substr(bx);
    }
    return fileName;
}
exports.path_getFileName = path_getFileName;
