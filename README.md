# prop-id-data-script


## 1. 住所の正規化 + ゴミデータの削除

```
caffeinate node data-cleansing.js
```

処理内容

1. 住所とビル名に以下を含むデータを削除
   - 住所
     - `仮|予定|部分|邸宅|貸家|階|号室|駐車場|駐輪場|,|\n`

   - ビル名
     - `仮|予定|駐車場|,|\n`

2. ビル名の正規化
   - 処理内容は [data-cleansing.test.js](./test/data-cleansing.test.js)をご覧ください

3. NJA で正規化レベル3以外を削除
   - レベル3（丁目まで）以外を含むデータを削除


## 2. 1住所に複数ビル名があるデータと1つのビル名データに分類

```
caffeinate node data-filter.js
```

処理内容

- 住所と正規化ビル名の重複データを削除
- 住所に対してビル名が複数あるデータを `multi-buildings.csv"` として出力。ビル名が一つのデータを `building.csv` として出力。


## 3. 号・番（号情報がない地域）以外の住所を削除

外部API を使用して、号・番（号情報がない地域）以外の住所を削除

```
caffeinate node data-geocode-filter.js
```


## 処理状況の確認

```
tail -f filter.csv
```
