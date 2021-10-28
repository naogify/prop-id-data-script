const { dataCleansing } = require('../data-cleansing')

describe('ビル名削除テスト', () => {

  test('駐輪場があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京駐輪場', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('駐車場があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京駐車場', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('仮 があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京（仮）', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('予定 があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京（予定）', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('部分 があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京（部分）', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('階 があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京（1階）', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('号室 があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京（1号室）', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('貸家 があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京（貸家）', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })

  test('邸宅 があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ東京（邸宅）', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([])
  })
  
})


describe('ビル名の正規化テスト', () => {

  test('中黒（・）があった場合に削除', async () => {
    const result = await dataCleansing([['ハイツ・東京', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ハイツ・東京', 'ﾊｲﾂ東京', '東京都千代田区永田町一丁目7-1']])
  })

  test('半角、全角スペースは削除', async () => {
    const result = await dataCleansing([['ハイツ　東京 1', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ハイツ　東京 1', 'ﾊｲﾂ東京1', '東京都千代田区永田町一丁目7-1']])
  })

  test('第、館、号、棟は削除', async () => {
    const result = await dataCleansing([['ハイツ東京第1号館 西棟', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ハイツ東京第1号館 西棟', 'ﾊｲﾂ東京1西', '東京都千代田区永田町一丁目7-1']])
  })

  test('全角アルファベット・数字は、半角、に直す', async () => {
    const result = await dataCleansing([['ハイツ東京Ａ１', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ハイツ東京Ａ１', 'ﾊｲﾂ東京A1', '東京都千代田区永田町一丁目7-1']])
  })

  test('横棒は、ハイフンで入力する', async () => {
    const result = await dataCleansing([['ハイツタワー', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ハイツタワー', 'ﾊｲﾂﾀﾜ-', '東京都千代田区永田町一丁目7-1']])
  })

  test('東西南北の英語（EAST や WEST）を日本語に変換', async () => {
    const result = await dataCleansing([['ハイツWEST', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ハイツWEST', 'ﾊｲﾂ西', '東京都千代田区永田町一丁目7-1']])
  })

  test('"ヴァ, ヴィ, ヴ, ヴェ, ヴォ" を "バ, ビ, ブ, ベ, ボ" に変換する', async () => {
    const result = await dataCleansing([['ヴァイオレット東', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ヴァイオレット東', 'ﾊﾞｲｵﾚｯﾄ東', '東京都千代田区永田町一丁目7-1']])
  })

  test('漢数字を半角アラビア数字に直す', async () => {
    const result = await dataCleansing([['ハイツ壱号館', '東京都千代田区永田町１丁目７−１']])
    expect(result).toMatchObject([['ハイツ壱号館', 'ﾊｲﾂ1', '東京都千代田区永田町一丁目7-1']])
  })

})
