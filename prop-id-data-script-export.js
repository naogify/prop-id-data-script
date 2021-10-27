#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createArrayCsvWriter } = require('csv-writer')
const csvSync = require('csv-parse/lib/sync'); // requiring sync module

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'filter.csv'), 'utf8')
  const rawData = csvSync(file);
  const buildingCSV = []
  const multiBuildingsCSV = []
  
  // 重複削除
  const map = new Map();
  rawData.forEach((item) => map.set(item.join(), item));
  const data = Array.from(map.values());

  // asc 行と住所が一致する行を削除

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const building = item[0]
    const address = item[1]

    if (building === "building" && address === "address") {
      continue
    }

    const result = data.filter(data => data[1] === address);

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

exportCSV()