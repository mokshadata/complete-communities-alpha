const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

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
  merge,
  omit,
  reject,
  isEmpty,
  either,
  pick,
} = require('ramda')

const metricKeys = [
  'Metrics to Measure Success 1',
  'Source 1',
  'Metrics to Measure Success 2',
  'Source 2',
  'Metrics to Measure Success 3',
  'Source 3',
]

const notProgramKeys = concat([
  'Action Steps',
  'Section',
  'Goal',
  'Projects',
  'Priority',
  'Timeframe',
  'Lead Partners',
  'Support Partners',
  'Potential Programs',
  'OZ Eligible',
])(metricKeys)

const listKeys = [
  'Lead Partners',
  'Support Partners',
  'Potential Programs',
]

module.exports = {
  getDataFromXLSXSync,
}

function getFullPath(relativeFilePath) {
  return path.join(__dirname, relativeFilePath)
}

function getDataFromSheet(workbook, sheetName) {
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: ''})
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
    map(pipe(
      setPrograms,
      setMetrics,
      setSteps,
      setLists,
      setId,
    )),
  )(projectsByNeighborhoods)
}

function setSteps(project) {
  return pipe(
    omit(['Action Steps']),
    merge({
      steps: project['Action Steps'].split(/; ?/),
    }),
  )(project)
}

function makeId(project) {
  const id = crypto.createHmac('sha256', 'PROJECT_ID')
    .update(JSON.stringify(pick(['Projects', 'neighborhood'], project)))
    .digest('hex')

  return {
    id,
  }
}

function setId(project) {
  return merge(makeId(project))(project)
}

function setPrograms(project) {
  let eligiblePrograms = pipe(
    omit(notProgramKeys),
    pickBy(
      either(equals(true), equals('')),
    ),
    keys,
  )( project )

  let excludedPrograms = pipe(
    omit(notProgramKeys),
    pickBy(
      equals(false),
    ),
    keys,
  )( project )

  if (project['OZ Eligible'] !== 'No' && project['OZ Eligible'] !== ''){
    eligiblePrograms = concat(eligiblePrograms, ['Opportunity Zone'])
  } else {
    excludedPrograms = concat(excludedPrograms, ['Opportunity Zone'])
  }
  return pipe(
    omit(concat(
      eligiblePrograms,
      excludedPrograms
    )),
    merge({
      eligiblePrograms,
      excludedPrograms,
    })
  )(project)
}

function parseMetric({ metric, source }) {
  const metricTimeRegex = / by (\d{4}) ?/
  const matchCurrent = /(In \d{4}|Currently)/
  const metricTimeRegexWithoutCurrent = / by \d{4} ?/
  const metricTimeRegexWithCurrent = / by \d{4}(.*?(?=(?:In|Currently))|$)/

  let parsedMetric = {}
  const [,year] = metric.match(metricTimeRegex) || []

  if (!year) {
    parsedMetric = {
      metric,
      source,
    }
  } else {
    const parts = (
      (
        metric.match(matchCurrent) &&
        metric.split(metricTimeRegexWithCurrent)
      ) ||
      metric.split(metricTimeRegexWithoutCurrent)
    )
    const now = parts.pop()
    const milestone = parts.join('')

    parsedMetric = {
      year,
      metric: milestone,
      now,
      source,
    }
  }

  return reject(isEmpty)(parsedMetric)
}

function setMetrics(project) {

  const metrics = pipe(
      reject(equals({
        metric: '',
        source: '',
      })),
      map(parseMetric),
    )([{
        metric: project['Metrics to Measure Success 1'],
        source: project['Source 1'],
      }, {
        metric: project['Metrics to Measure Success 2'],
        source: project['Source 2'],
      }, {
        metric: project['Metrics to Measure Success 3'],
        source: project['Source 3'],
      },
    ])

  return pipe(
    omit(metricKeys),
    merge({
      metrics,
    })
  )(project)
  
}

function setLists(project){
  return merge(project)(pipe(
      pick(listKeys),
      mapObjIndexed((value) => (
        (isEmpty(value) && []) ||
        value.split(/(?:,|;) ?/)
      ))
    )(project)
  )
}

const workbook = getDataFromXLSXSync('./data/complete-communities-workbook.xlsx')
const items = flattenToList(workbook)

fs.writeFileSync(getFullPath('./public/data/complete-communities-projects.json'), JSON.stringify(items))