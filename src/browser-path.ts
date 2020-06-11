
// ------------------------- path_getFileName ------------------------
// return the part of the path that follows the last "/" in the string.
export function path_getFileName(path : string ) : string
{
	let fileName = path;
	const fx = path.lastIndexOf('/');
	const bx = fx + 1;
	if ((bx > 0) && (bx < path.length))
	{
		fileName = path.substr(bx);
	}
	return fileName;
}
