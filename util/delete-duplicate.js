function deleteDuplicate(data) {
  // normalizedBuilding と address の 2つの列が、重複していた場合に削除
  const map = new Map();
  data.forEach((item) => map.set(`${item[1]}${2}`, item));
  return Array.from(map.values());
}

module.exports.deleteDuplicate = deleteDuplicate