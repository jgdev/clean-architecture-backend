import { OperationType } from "@/core/entities/Operation";
import OperationServiceFactory from "@/lib/services/OperationServiceFactory";
import OperationImpl from "@/lib/services/operations/OperationImpl";

describe("Operations", () => {
  let operation: OperationImpl;

  describe("Addition", () => {
    beforeEach(() => {
      operation = OperationServiceFactory.getOperationByType(
        OperationType.ADDITION
      );
    });
    it("should sum arguments", async () => {
      expect(await operation.perform([2, 2])).toBe(4); // Lol
      expect(await operation.perform([25, 72, 3])).toBe(100);
    });
    it("should validate arguments", async () => {
      expect.assertions(2);
      try {
        await operation.perform([]);
      } catch (err: any) {
        expect(err.message).toBe("Expecting at least two arguments");
      }
      try {
        await operation.perform([1, "a"]);
      } catch (err: any) {
        expect(err.message).toBe("Invalid operation parameter at index 1");
      }
    });
  });
  describe("SUBTRACTION", () => {
    beforeEach(() => {
      operation = OperationServiceFactory.getOperationByType(
        OperationType.SUBTRACTION
      );
    });
    it("should substract arguments", async () => {
      expect(await operation.perform([100, 30])).toBe(70);
      expect(await operation.perform([439, 12, 10])).toBe(417);
    });
    it("should validate arguments", async () => {
      expect.assertions(2);
      try {
        await operation.perform([]);
      } catch (err: any) {
        expect(err.message).toBe("Expecting at least two arguments");
      }
      try {
        await operation.perform([1, "a"]);
      } catch (err: any) {
        expect(err.message).toBe("Invalid operation parameter at index 1");
      }
    });
  });
  describe("Multiplication", () => {
    beforeEach(() => {
      operation = OperationServiceFactory.getOperationByType(
        OperationType.MULTIPLICATION
      );
    });
    it("should multiply arguments", async () => {
      expect(await operation.perform([2, 6])).toBe(12);
      expect(await operation.perform([2, 5, 5])).toBe(50);
    });
    it("should validate arguments", async () => {
      expect.assertions(2);
      try {
        await operation.perform([]);
      } catch (err: any) {
        expect(err.message).toBe("Expecting at least two arguments");
      }
      try {
        await operation.perform([1, "a"]);
      } catch (err: any) {
        expect(err.message).toBe("Invalid operation parameter at index 1");
      }
    });
  });
  describe("Division", () => {
    beforeEach(() => {
      operation = OperationServiceFactory.getOperationByType(
        OperationType.DIVISION
      );
    });
    it("should divide arguments", async () => {
      expect(await operation.perform([10, 2])).toBe(5);
      expect(await operation.perform([100, 10, 2, 2])).toBe(2.5);
    });
    it("should validate arguments", async () => {
      expect.assertions(2);
      try {
        await operation.perform([]);
      } catch (err: any) {
        expect(err.message).toBe("Expecting at least two arguments");
      }
      try {
        await operation.perform([1, "a"]);
      } catch (err: any) {
        expect(err.message).toBe("Invalid operation parameter at index 1");
      }
    });
  });
  describe("Square root", () => {
    beforeEach(() => {
      operation = OperationServiceFactory.getOperationByType(
        OperationType.SQUARE_ROOT
      );
    });
    it("should get square root", async () => {
      expect(await operation.perform([10])).toBe(3.1622776601683795);
      expect(await operation.perform([27])).toBe(5.196152422706632);
    });
    it("should validate arguments", async () => {
      expect.assertions(2);
      try {
        await operation.perform([]);
      } catch (err: any) {
        expect(err.message).toBe("Expecting one numeric argument");
      }
      try {
        await operation.perform("a");
      } catch (err: any) {
        expect(err.message).toBe("Expecting one numeric argument");
      }
    });
  });
  describe("Random String", () => {
    beforeEach(() => {
      operation = OperationServiceFactory.getOperationByType(
        OperationType.RANDOM_STRING
      );
    });
    it("should generate random string", async () => {
      expect(await operation.perform([10])).toHaveLength(10);
    });
    it("should validate arguments", async () => {
      expect.assertions(2);
      try {
        await operation.perform([]);
      } catch (err: any) {
        expect(err.message).toBe("Invalid random string length");
      }
      try {
        await operation.perform([10, true, false, false, false]);
      } catch (err: any) {
        expect(err.message).toBe(
          "When alphabetic is enabled, you should keep enabled lowerCase or upperCase"
        );
      }
    });
  });

  describe("Random String - External Provider", () => {
    test("should validate apiUrl constructor param", () => {
      expect.assertions(1);
      try {
        operation = OperationServiceFactory.getOperationByType(
          OperationType.RANDOM_STRING_V2
        );
      } catch (err: any) {
        expect(err.message).toBe(
          "environment variable RANDOM_ORG_API_URL is not defined"
        );
      }
    });
    test("should validate apiKey constructor param", () => {
      process.env.RANDOM_ORG_API_URL = "test";
      expect.assertions(1);
      try {
        operation = OperationServiceFactory.getOperationByType(
          OperationType.RANDOM_STRING_V2
        );
      } catch (err: any) {
        expect(err.message).toBe(
          "environment variable RANDOM_ORG_API_KEY is not defined"
        );
      }
    });
    test("should validate perform length param", async () => {
      process.env.RANDOM_ORG_API_URL = "testUrl";
      process.env.RANDOM_ORG_API_KEY = "testKey";
      expect.assertions(1);
      try {
        operation = OperationServiceFactory.getOperationByType(
          OperationType.RANDOM_STRING_V2
        );
        await operation.perform([60]);
      } catch (err: any) {
        expect(err.message).toBe(
          "String length should not be larger than 32 for this operation"
        );
      }
    });
    test("should call external service properly", async () => {
      process.env.RANDOM_ORG_API_URL = "testUrl";
      process.env.RANDOM_ORG_API_KEY = "testKey";
      const spy = jest.spyOn(globalThis, "fetch").mockReturnValue(
        Promise.resolve({
          json: async () => ({
            result: {
              random: { data: ["test"] },
            },
          }),
        } as any)
      );
      operation = OperationServiceFactory.getOperationByType(
        OperationType.RANDOM_STRING_V2
      );
      await operation.perform([10, true, true, true, true, true]);
      const [url, options] = spy.mock.calls[0];
      const body = JSON.parse(((options as any)?.body as string) || "");
      expect(url).toBe("testUrl");
      expect(body).toMatchObject({
        jsonrpc: "2.0",
        method: "generateStrings",
        params: { apiKey: "testKey", n: 1, length: 10 },
      });
    });
  });
});
