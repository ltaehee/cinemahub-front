type Param = {
  [key: string]: any;
};

export const emptyChecker = (param: Param) => {
  const objectValues = Object.values({ ...param });

  return (
    objectValues.includes('') ||
    objectValues.includes(0) ||
    objectValues.includes(undefined) ||
    objectValues.includes(null) ||
    objectValues.includes([]) ||
    objectValues.includes({})
  );
};
