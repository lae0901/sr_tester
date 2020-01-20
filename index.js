
// ----------------------------------- path_removeQueryString ---------------------
// find and remove the query string portion of the path 
function path_removeQueryString(str)
{
  const fx = str.indexOf('?');
  if (fx >= 0)
  {
    return str.substr(0, fx);
  }
  else
    return str;
}

export { path_removeQueryString} ;
