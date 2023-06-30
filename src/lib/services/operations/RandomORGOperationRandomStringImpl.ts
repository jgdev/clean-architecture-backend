import ValidatorError from "@/core/errors/ValidationError";
import OperationRandomStringGeneratorImpl from "./OperationRandomStringGeneratorImpl";

export default class RandomORGOperationRandomString extends OperationRandomStringGeneratorImpl {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl?: string, apiKey?: string) {
    super();
    if (!apiUrl)
      throw new Error("environment variable RANDOM_ORG_API_URL is not defined");
    if (!apiKey)
      throw new Error("environment variable RANDOM_ORG_API_KEY is not defined");
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async perform(args: any[]): Promise<string> {
    const length = args[0];
    if (length > 32)
      throw new ValidatorError(
        "String length should not be larger than 32 for this operation"
      );
    const characters = this.getCharacters(args);
    return this.buildRequest(length, characters);
  }

  private async buildRequest(length: number, characters: string) {
    return fetch(this.apiUrl, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "generateStrings",
        params: {
          apiKey: this.apiKey,
          n: 1,
          length,
          characters,
          replacement: true,
          pregeneratedRandomization: null,
        },
        id: 17761,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res.result.random.data[0]);
  }
}
