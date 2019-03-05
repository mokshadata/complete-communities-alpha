const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')
const {
  map,
  mapObjIndexed,
  flatten,
  values,
  assoc,
  pipe,
  equals,
  pickBy,
  keys,
  concat,
} = require('ramda')

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

function setKeyAsNeighborhood(list, neighborhood) {
  return map(assoc('neighborhood', neighborhood), list)
}

function flattenToList(projectsByNeighborhoods) {
  return pipe(
    mapObjIndexed(setKeyAsNeighborhood),
    values,
    flatten,
    map(setPrograms),
  )(projectsByNeighborhoods)
}

function setPrograms(project) {
  let eligiblePrograms = pipe(
    pickBy(
      equals(true),
    ),
    keys,
  )( project )
  if (project['OZ Eligible'] !== 'No' && project['OZ Eligible'] !== ''){
    eligiblePrograms = concat(eligiblePrograms, ['Opportunity Zone'])
  }
  return assoc('programs', eligiblePrograms)(project)
}

const workbook = getDataFromXLSXSync('./data/complete-communities-workbook.xlsx')
const items = flattenToList(workbook)

fs.writeFileSync(getFullPath('./public/data/complete-communities-projects.json'), JSON.stringify(items))