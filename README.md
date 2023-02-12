# tester repo

Not sure actually what this package is all about.  

Should not be confused with with `sr_test_framework` package!

## eventually create new package, sr_browser_ts.  Typescript functions designed to run from the browser. ( path functions that do not use path class, functions that do not use fs package. )

## testing history
* publish package to NPM does not include type declaration file.

## publish instructions
* increment version number in package.json
* npm run build
* git add, commit, push to repo
* npm publish
* npm update in projects which use this package
