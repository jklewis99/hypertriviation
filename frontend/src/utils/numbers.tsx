export function randomUniqueNumberList(range: number, outputCount?: number) {
  if (!outputCount) {
    outputCount = range;
  }
  let arr = []
  for (let i = 0; i < range; i++) {
    arr.push(i)
  }

  let result = [];

  for (let i = 1; i <= outputCount; i++) {
    const random = Math.floor(Math.random() * (range - i));
    result.push(arr[random]);
    arr[random] = arr[range - i];
  }

  return result;
}