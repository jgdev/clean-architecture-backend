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
});
