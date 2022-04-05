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

/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param array 
 * @returns 
 */
export function knuthShuffle(array: any[]) {
  console.log("hello")
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

/**
 * returns a random number between min (inclusive) and max (exclusive)
 * @param min 
 * @param max 
 * @returns 
 */
export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}