export function updateArray<T>(
  array: T[],
  index: number,
  update: (value: T) => T,
): T[] {
  const nextArray = Array.from(array);
  nextArray[index] = update(array[index]);
  return nextArray;
}
