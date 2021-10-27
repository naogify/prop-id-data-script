# prop-id-data-script


## 住所の正規化 + ゴミデータの削除

### 住所とビル名に以下を含むデータを削除

住所
 - 仮|予定|部分|邸宅|貸家|階|号室|駐車場|駐輪場|,|\n

ビル名
- /仮|予定|駐車場|,|\n/

### NJA で正規化レベル3以外を削除
- レベル3（丁目まで）以外を含むデータを削除

```
caffeinate node prop-id-data-script-cleansing.js
```

## 1住所1建物と1住所複数建物に分類

- 住所とビル名の重複データを削除
- 住所に対してビル名が複数あるデータを `multi-buildings.csv"` として出力。ビル名が一つのデータを `building.csv` として出力。

```
caffeinate node prop-id-data-script-export.js
```


## 処理状況の確認

```
tail -f filter.csv
```
