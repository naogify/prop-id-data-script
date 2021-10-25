#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createArrayCsvWriter } = require('csv-writer')
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const { normalize } = require('@geolonia/normalize-japanese-addresses')

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'all-buldings.csv'), 'utf8')
  const data = csvSync(file);
  const outCSV = []

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const building = item[0]
    const address = item[1]

    const isBuilding = building.match(/仮|予定|部分/g)

    const normalized = await normalize(address)

    if (isBuilding === null && normalized.level === 3 && (normalized.addr !== '')) {
      outCSV.push([
        building,
        `${normalized.pref}${normalized.city}${normalized.town}${normalized.addr}`
      ])
    }
  }

  const csvWriter = createArrayCsvWriter({
    header: ['building', 'address'],
    path: "./output.csv",
  })

  csvWriter.writeRecords(outCSV)
}

exportCSV()
