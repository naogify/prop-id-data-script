#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const csvSync = require('csv-parse/lib/sync'); // requiring sync module
const { normalize } = require('@geolonia/normalize-japanese-addresses')
const { kanji2number, findKanjiNumbers } = require('@geolonia/japanese-numeral')
const jaconv = require('jaconv')
const { createArrayCsvWriter } = require('csv-writer')

function kan2num(string) {
  const kanjiNumbers = findKanjiNumbers(string)
  for (let i = 0; i < kanjiNumbers.length; i++) {
    // @ts-ignore
    string = string.replace(kanjiNumbers[i], kanji2number(kanjiNumbers[i]))
  }
  return string
}

function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096]/g, function(match) {
      var chr = match.charCodeAt(0) + 0x60;
      return String.fromCharCode(chr);
  });
}

async function dataCleansing(data) {
  const outCSV = []

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const building = item[0]
    const address = item[1]
    const normalized = await normalize(address)

    const isBuilding = building.match(/仮|予定|部分|邸宅|貸家|階|号室|駐車場|駐輪場|店舗|戸建|駅前|\n/g)
    const isAddr =  normalized.addr.match(/仮|予定|駐車場|,|\n/g)

    if (isBuilding === null && isAddr === null && normalized.level === 3 && building !== '' & normalized.addr !== '') {

      let normalizedBuilding = building;

      // 中黒（・）があった場合に削除
      normalizedBuilding = normalizedBuilding.replace(/・|･/g, '')
      // ？があった場合に削除
      normalizedBuilding = normalizedBuilding.replace(/\？|\?/g, '')
      // №(ナンバー)をnoに変換
      normalizedBuilding = normalizedBuilding.replace(/№/g, 'no')
      // ピリオド、カンマ、アポストロフィーを削除
      normalizedBuilding = normalizedBuilding.replace(/\.|\.|\．|\，|\,|\＇|\'|\’|\´|\‘/g, '')
      // が、ガ、ヶ は ｶﾞに変換
      normalizedBuilding = normalizedBuilding.replace(/が|ガ|ヶ/g, 'ｶﾞ')
      // ひらがなとカタカナ（全角半角）の伸ばし棒は削除
      normalizedBuilding = normalizedBuilding.replace(/ー|ー|ｰ/g, '')
      // 空白文字を削除
      normalizedBuilding = normalizedBuilding.replace(/\s+/g, '')
      // 括弧があれば中の文字を含めて削除
      normalizedBuilding = normalizedBuilding.replace(/\(.+?\)|\（.+?\）|\【.+?\】/g, '')
      // 第、館、号、棟は削除
      normalizedBuilding = normalizedBuilding.replace(/第|館|号|棟|番/g, '')
      // ひらがなをカタカナに直す
      normalizedBuilding = hiraToKana(normalizedBuilding)
      //ヴァ, ヴィ, ヴ, ヴェ, ヴォ を ﾊﾞ, ﾋﾞ, ﾌﾞ, ﾍﾞ, ﾎﾞ に変換
      normalizedBuilding = normalizedBuilding.replace(/ヴァ|ｳﾞｧ/g, 'ﾊﾞ')
      normalizedBuilding = normalizedBuilding.replace(/ヴィ|ｳﾞｨ/g, 'ﾋﾞ')
      normalizedBuilding = normalizedBuilding.replace(/ヴェ|ｳﾞｪﾞ|ウ゛ェ/g, 'ﾍﾞ')
      normalizedBuilding = normalizedBuilding.replace(/ヴォ|ｳﾞｫﾞ/g, 'ﾎﾞ')

      // 全角英数記号、カタカナ、ローマ数字を半角に変換
      normalizedBuilding = await jaconv.toHan(normalizedBuilding)
      // 半角ローマ数字をアラビア数字に変換（MacデフォルトIMIとGoogle日本語入力では12までしか入力できない）
      normalizedBuilding = normalizedBuilding.replace(/ⅰ/g, '1')
      normalizedBuilding = normalizedBuilding.replace(/ⅱ/g, '2')
      normalizedBuilding = normalizedBuilding.replace(/ⅲ/g, '3')
      normalizedBuilding = normalizedBuilding.replace(/ⅳ/g, '4')
      normalizedBuilding = normalizedBuilding.replace(/ⅴ/g, '5')
      normalizedBuilding = normalizedBuilding.replace(/ⅵ/g, '6')
      normalizedBuilding = normalizedBuilding.replace(/ⅶ/g, '7')
      normalizedBuilding = normalizedBuilding.replace(/ⅷ/g, '8')
      normalizedBuilding = normalizedBuilding.replace(/ⅸ/g, '9')
      normalizedBuilding = normalizedBuilding.replace(/ⅹ/g, '10')
      normalizedBuilding = normalizedBuilding.replace(/ⅺ/g, '11')
      normalizedBuilding = normalizedBuilding.replace(/ⅻ/g, '12')
      // 漢数字を半角アラビア数字に直す
      normalizedBuilding = await kan2num(normalizedBuilding)
      // 横棒をハイフンに変換
      normalizedBuilding = normalizedBuilding.replace(/[-－﹣−‐⁃‑‒–—﹘―⎯⏤ーｰ─━]/g, '-')
      // 英語を日本語に変換
      normalizedBuilding = normalizedBuilding.replace(/North|NORTH|north|ﾉｰｽ|ノース/g, '北')
      normalizedBuilding = normalizedBuilding.replace(/South|SOUTH|south|ｻｳｽ|サウス/g, '南')
      normalizedBuilding = normalizedBuilding.replace(/East|EAST|east|ｲｰｽﾄ|イースト/g, '東')
      normalizedBuilding = normalizedBuilding.replace(/West|WEST|west|ｳｴｽﾄ|ウエスト/g, '西')
      // アルファベットを小文字に変換
      normalizedBuilding = normalizedBuilding.toLowerCase()

      // ♯ を # に変換する
      normalizedBuilding = normalizedBuilding.replace(/♯/g, '#')


      //ァィゥェォッャュョ を ｱｲｳｴｵﾂﾔﾕﾖ に変換
      normalizedBuilding = normalizedBuilding.replace(/ァ|ｧ/g, 'ｱ')
      normalizedBuilding = normalizedBuilding.replace(/ィ|ｨ/g, 'ｲ')
      normalizedBuilding = normalizedBuilding.replace(/ゥ|ｩ/g, 'ｳ')
      normalizedBuilding = normalizedBuilding.replace(/ェ|ｪ/g, 'ｴ')
      normalizedBuilding = normalizedBuilding.replace(/ォ|ｫ/g, 'ｵ')
      normalizedBuilding = normalizedBuilding.replace(/ッ|ｯ/g, 'ﾂ')
      normalizedBuilding = normalizedBuilding.replace(/ャ|ｬ/g, 'ﾔ')
      normalizedBuilding = normalizedBuilding.replace(/ュ|ｭ/g, 'ﾕ')
      normalizedBuilding = normalizedBuilding.replace(/ョ|ｮ/g, 'ﾖ')

      outCSV.push([
        building,
        normalizedBuilding,
        `${normalized.pref}${normalized.city}${normalized.town}${normalized.addr}`
      ])
    }
  }
  
  return outCSV
}

async function exportCSV() {

  const file = fs.readFileSync(path.join(__dirname, 'all-buildings.csv'), 'utf8')
  const data = csvSync(file);

  const outCSV = await dataCleansing(data)

  const csvWriterBuilding = createArrayCsvWriter({
    header: ['building', 'normalizedBuilding', 'address'],
    path: "./cleansing.csv",
  })
  csvWriterBuilding.writeRecords(outCSV)
}

// テストで読み込み時に実行しない
if (require.main === module) {
  exportCSV()
}

exports.dataCleansing = dataCleansing