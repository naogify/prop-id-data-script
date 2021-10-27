#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const { normalize } = require('@geolonia/normalize-japanese-addresses')
const { kanji2number, findKanjiNumbers } = require('@geolonia/japanese-numeral')
const roman = require('romans');
const jaconv = require((jaconv))
const Kuroshiro = require("kuroshiro")

function kan2num(string) {
  const kanjiNumbers = findKanjiNumbers(string)
  for (let i = 0; i < kanjiNumbers.length; i++) {
    // @ts-ignore
    string = string.replace(kanjiNumbers[i], kanji2number(kanjiNumbers[i]))
  }
  return string
}

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'all-buildings.csv'), 'utf8')
  const data = csvSync(file);

  const fd = fs.openSync('./filter.csv', 'w')

  fs.writeFileSync(fd, `building,normalizedBuilding,address\n`)

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const building = item[0]
    const address = item[1]
    const normalized = await normalize(address)

    const isBuilding = building.match(/仮|予定|部分|邸宅|貸家|階|号室|駐車場|駐輪場|,|\n/g)
    const isAddr =  normalized.addr.match(/仮|予定|駐車場|,|\n/g)

    if (isBuilding === null && isAddr === null && normalized.level === 3 && normalized.addr !== '') {

      let normalizedBuilding = building;

      // ひらがなをカタカナに変換
      normalizedBuilding = Kuroshiro.Util.kanaToKatakana(normalizedBuilding)
      // 中黒（・）があった場合に削除
      normalizedBuilding = normalizedBuilding.replace(/・/g, '')
      // 空白文字を削除
      normalizedBuilding = normalizedBuilding.replace(/\s+/g, '')
      // 第、館、号、棟は削除
      normalizedBuilding = normalizedBuilding.replace(/第|館|号|棟/g, '')
      //ヴァ, ヴィ, ヴ, ヴェ, ヴォ を ﾊﾞ, ﾋﾞ, ﾌﾞ, ﾍﾞ, ﾎﾞ に変換
      normalizedBuilding = normalizedBuilding.replace(/ヴァ|ｳﾞｧ/g, 'ﾊﾞ')
      normalizedBuilding = normalizedBuilding.replace(/ヴィ|ｳﾞｨ/g, 'ﾋﾞ')
      normalizedBuilding = normalizedBuilding.replace(/ヴ|ｳﾞ/g, 'ﾌﾞ')
      normalizedBuilding = normalizedBuilding.replace(/ヴェ|ｳﾞｪﾞ/g, 'ﾍﾞ')
      normalizedBuilding = normalizedBuilding.replace(/ヴォ|ｳﾞｫﾞ/g, 'ﾎﾞ')
      // 全角英数記号、カタカナを半角に変換
      normalizedBuilding = jconv.toHan(normalizedBuilding)
      // 漢数字を半角アラビア数字に直す
      normalizedBuilding = kan2num(normalizedBuilding)
      // ローマ数字を半角アラビア数字に直す
      normalizedBuilding = roman.deromanize(normalizedBuilding)
      // 横棒をハイフンに変換
      normalizedBuilding = normalizedBuilding.replace(/[-－﹣−‐⁃‑‒–—﹘―⎯⏤ーｰ─━]/g, '-')
      // 英語を日本語に変換
      normalizedBuilding = normalizedBuilding.replace(/North|NORTH|north/g, '北')
      normalizedBuilding = normalizedBuilding.replace(/South|SOUTH|south/g, '南')
      normalizedBuilding = normalizedBuilding.replace(/East|EAST|east/g, '東')
      normalizedBuilding = normalizedBuilding.replace(/West|WEST|west/g, '西')

      fs.writeFileSync(fd, `${building},${normalizedBuilding},${normalized.pref}${normalized.city}${normalized.town}${normalized.addr}\n`)
    }
  }

  fs.closeSync(fd)
}

exportCSV()
