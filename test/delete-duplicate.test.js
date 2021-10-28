const { deleteDuplicate } = require('../util/delete-duplicate')

test('normalizedBuilding と address の2つの列が重複していた場合、重複を1つする', () => {
  const data = [
    ['ハイツWEST', 'ﾊｲﾂ西', '東京都千代田区永田町一丁目7-1'],
    ['ハイツ西棟', 'ﾊｲﾂ西', '東京都千代田区永田町一丁目7-1'],
    ['ハイツタワー', 'ﾊｲﾂﾀﾜ-', '東京都千代田区永田町一丁目7-1'],
  ]
  const expectValue = [
    ['ハイツ西棟', 'ﾊｲﾂ西', '東京都千代田区永田町一丁目7-1'],
    ['ハイツタワー', 'ﾊｲﾂﾀﾜ-', '東京都千代田区永田町一丁目7-1'],
  ]
  const result = deleteDuplicate(data)
  expect(result).toMatchObject(expectValue)
})