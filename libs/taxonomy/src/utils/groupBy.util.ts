export const groupByOne = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) => {
  return list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);

    previous[group] = currentItem;
    return previous;
  }, {} as Record<K, T>);
};

export const groupByMany = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) => {
  return list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);

    if (!previous[group]) {
      previous[group] = [];
    }

    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
};
