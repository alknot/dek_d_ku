export const getFieldValue = (obj: any, field: string) => {
  return field
    .split('.')
    .reduce((o, key) => (o !== null && o !== undefined && key in o ? o[key] : null), obj);
};
