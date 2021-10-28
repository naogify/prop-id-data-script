const { verifyAddress } = require('../util/verify-address')

describe('IncrementP Verification API', () => {
  test('Should verify an address via API', async () => {
    const address ="盛岡市盛岡駅西通町２丁目９番地１号 マリオス10F"
    const result = await verifyAddress(address)
    expect(result.status).toEqual(200)
    expect(result.ok).toEqual(true)
    expect(result.body).toEqual({
        "type": "FeatureCollection",
        "query": [
          "盛岡市盛岡駅西通町２丁目９番地１号 マリオス10F"
        ],
        "features": [
          {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [
                141.13366,
                39.701281
              ]
            },
            "properties": {
              "query": "盛岡市盛岡駅西通町２丁目９番地１号 マリオス10F",
              "place_name": "岩手県盛岡市盛岡駅西通2丁目 9-1 マリオス10F",
              "pref": "岩手県",
              "pref_kana": "イワテケン",
              "city": "盛岡市",
              "city_kana": "モリオカシ",
              "area": "盛岡駅西通",
              "area_kana": "モリオカエキニシドオリ",
              "koaza_chome": "2丁目",
              "koaza_chome_kana": "2チョウメ",
              "banchi_go": "9-1",
              "building": "マリオス",
              "building_number": "10F",
              "zipcode": "0200045",
              "geocoding_level": 8,
              "geocoding_level_desc": "号レベルでマッチしました(8)",
              "log": "FL001:都道府県名を補完しました(岩手県) | RM001:文字を除去しました(町)",
              "not_normalized": "",
            }
          }
        ],
        "attribution": "(c) INCREMENT P CORPORATION"
      })
  })
})