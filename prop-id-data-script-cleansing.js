#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const { normalize } = require('@geolonia/normalize-japanese-addresses')

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'all-buldings.csv'), 'utf8')
  const data = csvSync(file);

  const fd = fs.openSync('./filter.csv', 'w')

  fs.writeFileSync(fd, `building,address\n`)

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const building = item[0]
    const address = item[1]
    const normalized = await normalize(address)

    const isBuilding = building.match(/仮|予定|部分|邸宅|貸家|階|号室|駐車場/g)
    const isAddr =  normalized.addr.match(/仮/g)

    if (isBuilding === null && isAddr === null && normalized.level === 3 && normalized.addr !== '') {

      fs.writeFileSync(fd, `${building},${normalized.pref}${normalized.city}${normalized.town}${normalized.addr}\n`)
    }
  }

  fs.closeSync(fd)
}

exportCSV()
