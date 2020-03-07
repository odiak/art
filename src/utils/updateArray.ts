export function updateArray<T>(array: Array<T>, index: number, f: (value: T) => T): Array<T> {
  const newArray = Array.from(array)
  newArray[index] = f(array[index])
  return newArray
}
