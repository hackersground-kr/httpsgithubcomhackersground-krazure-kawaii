function countArr(arr) {
  let totalCount = 0;

  for (const relation of arr) {
    totalCount++;
  }

  return totalCount;
}

module.exports = countArr