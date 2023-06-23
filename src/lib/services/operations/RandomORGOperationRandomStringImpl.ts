import OperationRandomStringGeneratorImpl from "./OperationRandomStringGeneratorImpl";

export default class RandomORGOperationRandomString extends OperationRandomStringGeneratorImpl {
  async perform(args: any[]): Promise<string> {
    const characters = this.getCharacters(args);
    return characters;
  }
}
