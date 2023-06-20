export const isValidEmail = (email: string) =>
  /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(email);
