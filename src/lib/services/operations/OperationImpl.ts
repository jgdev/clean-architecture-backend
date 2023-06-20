export default abstract class OperationImpl {
  abstract perform(...args: any[]): Promise<any>;
}
