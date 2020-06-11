
// ------------------------- path_getFileName ------------------------

import { scan_revCharEqAny } from "./main";

// return the part of the path that follows the last "/" in the string.
export function path_getFileName(path : string ) : string
{
	let fileName = path;
	const fx = scan_revCharEqAny(path, path.length - 1, '\\/' );
	// let fx = path.lastIndexOf('/');
	const bx = fx + 1;
	if ((bx > 0) && (bx < path.length))
	{
		fileName = path.substr(bx);
	}
	return fileName;
}
