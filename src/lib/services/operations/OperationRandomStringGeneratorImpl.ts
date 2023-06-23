import ValidatorError from "@/core/errors/ValidationError";
import OperationImpl from "./OperationImpl";

export default class OperationRandomStringGeneratorImpl
  implements OperationImpl
{
  getCharacters(args: any[]) {
    const [
      length = 0,
      alphabetic = true,
      upperCase = true,
      lowerCase = true,
      numeric = true,
    ] = args;

    if (!length) throw new ValidatorError("Invalid random string length");

    let s = "";

    if (alphabetic && !lowerCase && !upperCase)
      throw new ValidatorError(
        "When alphabetic is enabled, you should keep enabled lowerCase or upperCase"
      );
    if (alphabetic && lowerCase) s += "abcdefghijklmnopqrstuvwxyz";
    if (alphabetic && upperCase) s += "ABCDEFGHIJKLMOPQRSTUVWXYZ";
    if (numeric) s += "0123456789";

    return s;
  }

  async perform(args: any[]): Promise<string> {
    const characters = this.getCharacters(args);
    return Array(args[0])
      .join()
      .split(",")
      .map(function () {
        return characters.charAt(Math.floor(Math.random() * characters.length));
      })
      .join("");
  }
}
