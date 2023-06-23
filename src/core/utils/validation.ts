export const isValidEmail = (email: string) =>
  /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(email);

export const parseNumberOrDefault = (value: any, defaultValue: number) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const objectOrDefault = (value: any, defaultValue: any) => {
  return value || defaultValue;
};
