export const MapRelation = (relationName: string) => {
  return ({ value }) => {
    return Array.isArray(value)
      ? value.map((id) => ({
          [relationName]: { id },
        }))
      : { id: value };
  };
};

export const ParseBooleanValues = (obj: any) => {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(ParseBooleanValues);
    } else {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (
            typeof value === 'string' &&
            (value === 'true' || value === 'false')
          ) {
            result[key] = value === 'true';
          } else {
            result[key] = ParseBooleanValues(value);
          }
        }
      }
      return result;
    }
  } else {
    return obj;
  }
};
