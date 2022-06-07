export const omit = (obj: {[key: string]: unknown}, keyToRemove: string) => {
  return Object.keys(obj)
    .filter(key => key !== keyToRemove)
    .reduce(
      (res: {[key: string]: unknown}, key) => ((res[key] = obj[key]), res),
      {}
    );
};
