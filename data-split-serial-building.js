#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { createArrayCsvWriter } = require('csv-writer')
const csvSync = require('csv-parse/lib/sync')

async function dataSplitListBuilding(data) {

  // 住所がキーのデータを作成
  const addressKeyObject = {}

  for (let i = 0; i < data.length; i++) {

    const item = data[i];
    const building = item[0]
    const normalizedBuilding = item[1]
    const address = item[2]

    if (building === "building" && normalizedBuilding === "normalizedBuilding" && address === "address") {
      continue
    }

    if (!addressKeyObject[address]) {
      const sameAddressRows = data.filter(data => data[2] === address);
      addressKeyObject[address] = sameAddressRows
    }
  }
  
  // 同じ住所で、正規化後のビル名の 数字・アルファベットを後ろから削除したものが全てマッチすれば連番
  const multiBuildingsSerialsCSV = []
  const multiBuildingsRandomCSV = []

  for (const [key, value] of Object.entries(addressKeyObject)) {

    const item = addressKeyObject[key]

    //数字とアルファベットと12までのローマ数字を削除（MacデフォルトIMIとGoogle日本語入力では12までしか入力できない）
    const onlyBuildingNames = item.map(row => row[1].replace(/[0-9a-zA-Z]|[ⅰ-ⅻ]|[Ⅰ-Ⅻ]|[①-⑩]|[❶-➓]|[⑴-⒑]/g, ''))

    if (!onlyBuildingNames.includes('') ) {

          //重複を削除。配列の要素が同じ値なら要素が1つの配列になる
          const hasSameValues = [...new Set(onlyBuildingNames)]

          if (hasSameValues.length === 1) {

            item.forEach((data) => {
              multiBuildingsSerialsCSV.push(
                [data[0], data[1], data[2]]
              )
            })
          } else {
            item.forEach((data) => {
              multiBuildingsRandomCSV.push(
                [data[0], data[1], data[2]]
              )
            })
          }
    } else {
      item.forEach((data) => {
        multiBuildingsRandomCSV.push(
          [data[0], data[1], data[2]]
        )
      })
    }
  }

  return {
    multiBuildingsRandom: multiBuildingsRandomCSV,
    multiBuildingsSerials: multiBuildingsSerialsCSV
  }
}

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'multi-buildings-filter-geocoding-level.csv'), 'utf8')
  const data = csvSync(file);
  const {multiBuildingsRandom, multiBuildingsSerials} = await dataSplitListBuilding(data)

  const csvWriterBuilding = createArrayCsvWriter({
    header: ['building', 'normalizedBuilding', 'address'],
    path: "./multi-building-random.csv",
  })

  const csvWriterMultiBuildings = createArrayCsvWriter({
    header: ['building', 'normalizedBuilding', 'address'],
    path: "./multi-building-serial.csv",
  })

  csvWriterBuilding.writeRecords(multiBuildingsRandom)
  csvWriterMultiBuildings.writeRecords(multiBuildingsSerials)
}

// テストで読み込み時に実行しない
if (require.main === module) {
  exportCSV()
}

exports.dataSplitListBuilding = dataSplitListBuilding