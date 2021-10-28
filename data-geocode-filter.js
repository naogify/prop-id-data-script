#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createArrayCsvWriter } = require('csv-writer')
const csvSync = require('csv-parse/lib/sync')
const { verifyAddress } = require('./util/verify-address')

async function dataFilterGeocodingLevel(data) {

  const outCSV = []

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const building = item[0]
    const normalizedBuilding = item[1]
    const address = item[2]

    if (building === "building" && normalizedBuilding === "normalizedBuilding" && address === "address") {
      continue
    }

    const result = await verifyAddress(address)

    if (result.status === 200 && result.ok) {

      const geocodingLevel = result.body.features[0].properties.geocoding_level

      // 号レベル or 番地（号情報が存在しない地域）の住所のみ追加
      if (geocodingLevel === 7 || geocodingLevel === 8) {
        outCSV.push(
          [building, normalizedBuilding, address]
        )
      }
    }
  }
  return outCSV
}

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'multi-buildings.csv'), 'utf8')
  const rawData = csvSync(file);

  const outCSV = await dataFilterGeocodingLevel(rawData)

  const csvWriterMultiBuildings = createArrayCsvWriter({
    header: ['building', 'normalizedBuilding', 'address'],
    path: "./multi-buildings-filter-geocoding-level.csv",
  })
  csvWriterMultiBuildings.writeRecords(outCSV)
}

// テストで読み込み時に実行しない
if (require.main === module) {
  exportCSV()
}

exports.dataFilterGeocodingLevel = dataFilterGeocodingLevel