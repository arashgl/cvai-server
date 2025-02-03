import { ValidationError } from 'class-validator';

export function formatErrorData(data: ValidationError[]) {
  const formattedData = {};
  for (const item of data) {
    if (item?.children?.length) {
      formattedData[item.property] = item.children.map((data) => {
        if (data.constraints) return Object.values(data.constraints)?.[0];
        return data.children.map((data) => ({
          [data.property]: Object.values(data.constraints)[0],
        }));
      })?.[0];
    } else {
      formattedData[item.property] = Object.values(item.constraints)[0];
    }
  }
  return formattedData;
}
