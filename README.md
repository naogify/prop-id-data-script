# prop-id-data-script


1住所に複数建物が存在するかを確認するスクリプトです。`all-buildings.csv` を ルートに配置して上から順番に実行して下さい。


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

## 4. 連番のビルとそうでないものを仕分け
- 連番のビル名を、`multi-building-serial.csv` 、そうでないものを `multi-building-random.csv` として出力。
- アルファベットのビル名の連番仕分けは未対応（例：`NIPPON STATES A号館、NIPPON STATES b号館`）

```
caffeinate node data-split-serial-building.js
```


## 処理状況の確認

リアルタイムに filter.csv の最後の行をターミナルに表示

```
tail -f filter.csv
```

`data-geocode-filter.js` が実行されているか確認

```
ps awwwux | grep data-geocode-filter.js
```
