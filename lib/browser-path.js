"use strict";
// ------------------------- path_getFileName ------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.path_splitBaseName = exports.path_getFileName = void 0;
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
// ------------------------------ path_splitBaseName ------------------------------
function path_splitBaseName(path) {
    const baseName = path_getFileName(path);
    let coreName = baseName;
    let extName = '';
    let ix = baseName.length - 1;
    while (ix >= 0) {
        const ch1 = baseName.substr(ix, 1);
        if (ch1 == '.') {
            extName = baseName.substr(ix);
            break;
        }
    }
    return { coreName, extName };
}
exports.path_splitBaseName = path_splitBaseName;
