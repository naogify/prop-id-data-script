# prop-id-data-script


## 住所の正規化 + ゴミデータの削除

```
caffeinate node prop-id-data-script-cleansing.js
```

## 1住所1建物と1住所複数建物に分類
```
caffeinate node prop-id-data-script-export.js
```


## 処理状況の確認

```
tail -f filter.csv
```
