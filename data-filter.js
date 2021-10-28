#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createArrayCsvWriter } = require('csv-writer')
const csvSync = require('csv-parse/lib/sync')
const { deleteDuplicate } = require('./util/delete-duplicate')

async function dataFilter(rawData) {

  const buildingCSV = []
  const multiBuildingsCSV = []

  // normalizedBuilding と address の 2つの列が、重複していた場合に削除
  const data = deleteDuplicate(rawData)

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const building = item[0]
    const normalizedBuilding = item[1]
    const address = item[2]

    if (building === "building" && normalizedBuilding === "normalizedBuilding" && address === "address") {
      continue
    }

    const result = data.filter(data => data[2] === address);

    if (result.length > 1) {
      multiBuildingsCSV.push(
        [building, address]
      )
    } else {
      buildingCSV.push(
        [building, address]
      )
    }
  }

  return {
    buildingCSV: buildingCSV,
    multiBuildingsCSV: multiBuildingsCSV
  }
}

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'cleansing.csv'), 'utf8')
  const rawData = csvSync(file);
  const {buildingCSV, multiBuildingsCSV} = await dataFilter(rawData)

  const csvWriterBuilding = createArrayCsvWriter({
    header: ['building', 'address'],
    path: "./building.csv",
  })

  const csvWriterMultiBuildings = createArrayCsvWriter({
    header: ['building', 'address'],
    path: "./multi-buildings.csv",
  })

  csvWriterBuilding.writeRecords(buildingCSV)
  csvWriterMultiBuildings.writeRecords(multiBuildingsCSV)
}

// テストで読み込み時に実行しない
if (require.main === module) {
  exportCSV()
}

exports.dataFilter = dataFilter