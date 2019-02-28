const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')

module.exports = {
  getDataFromXLSXSync,
}

function getFullPath(relativeFilePath) {
  return path.join(__dirname, relativeFilePath)
}

function getDataFromSheet(workbook, sheetName) {
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: ""})
}

function joinDataFromSheet(workbook, data, sheetName) {
  data[sheetName] = getDataFromSheet(workbook, sheetName)
  return data
}

function getDataFromXLSXSync(relativeFilePath) {
  const workbook = XLSX.readFile(getFullPath(relativeFilePath))
  return workbook.SheetNames.reduce(joinDataFromSheet.bind(null, workbook), {})
}

const workbook = getDataFromXLSXSync('./data/complete-communities-workbook.xlsx')

fs.writeFileSync(getFullPath('./public/data/complete-communities-projects.json'), JSON.stringify(workbook))