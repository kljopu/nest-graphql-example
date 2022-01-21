export const diff = <T>(source: T, target: Partial<T>): Partial<T> => {
  const data: Partial<T> = {};
  for (const [key, value] of Object.entries(target)) {
    if (source[key] !== value) {
      data[key] = value;
    }
  }
  return data;
};
