const path = require("path")

module.exports = path.dirname(process.mainModule.filename)

/* process.mainModule.filename:
process.mainModule refers to the main module that was run initially 
(i.e., the entry point of the application). 
filename is a property of mainModule that contains the fully resolved filename of that main module.
For example, if you run your application using node app.js, 
process.mainModule.filename would be the full path to app.js.*/