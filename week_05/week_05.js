var csv = require('fast-csv');

const csvPath = "climate_temperature_month_avg.csv";

var year = []
let month = []
let austrilia = []
let chile = []
let switzerland = []
let usa = []

csv.fromPath(csvPath)
// on('data', function(data) {
//     year.push(data[0])
// })

console.log(year)
