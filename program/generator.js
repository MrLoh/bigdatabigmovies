const jade = require("jade")
const fs = require("fs")

var programSD = require("./science_day.json")
var programID = require("./industry_day.json")

var template = jade.compileFile("template.jade", {pretty: "\t"})

fs.writeFileSync("science_day.html", template(programSD))
fs.writeFileSync("industry_day.html", template(programID))
