import supertest from "supertest";
import { Server } from "http";
import httpStatus from "http-status";
import KoaRouter from "koa-router";
import { randomUUID } from "crypto";

import User from "@/core/entities/User";
import ValidatorError from "@/core/errors/ValidationError";
import AuthorizationError from "@/core/errors/AuthorizationError";
import { BaseError } from "@/core/errors";
import CreateUserSessionController from "@/infrastructure/api/controllers/CreateUserSessionController";
import CreateUserSessionUseCase from "@/core/use-cases/CreateUserSessionUseCase";
import RemoveUserSessionController from "@/infrastructure/api/controllers/RemoveUserSessionController";
import RemoveUserSessionUseCase from "@/core/use-cases/RemoveUserSessionUseCase";

import { Api, ApiDeps, createApi } from "@/infrastructure/api";
import { prepareTestEnvironment } from "../unit/utils/InMemory.bootstrap";
import CreateRecordController from "@/infrastructure/api/controllers/CreateRecordController";
import CreateRecordUseCase from "@/core/use-cases/CreateRecordUseCase";
import ListRecordsController from "@/infrastructure/api/controllers/ListRecordsController";
import ListRecordsUseCase from "@/core/use-cases/ListRecordsUseCase";
import RemoveRecordController from "@/infrastructure/api/controllers/RemoveRecordController";
import RemoveRecordUseCase from "@/core/use-cases/RemoveRecordUseCase";
import ListOperationsController from "@/infrastructure/api/controllers/ListOperationsController";
import ListOperaitonsUseCase from "@/core/use-cases/ListOperationsUseCase";

describe("Api", () => {
  let deps: ApiDeps & { testUser: User };
  let api: Api;
  let server: Server;
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    deps = await prepareTestEnvironment();
    api = createApi(deps, true);
    server = api.listen();
    request = supertest(server);
  });

  afterEach(() => {
    jest.clearAllMocks();
    server.close();
  });

  describe("Auth", () => {
    test("should expect X-Session-Id header when the endpoint it's protected", (callback) => {
      // close previous server
      server.close();

      // instantiate new api with session validation
      api = createApi(deps, false);
      server = api.listen();
      request = supertest(server);

      const testRouter = new KoaRouter();

      testRouter.get("/some-protected-endpoint", api.withSession, (ctx) => {
        ctx.body = true;
      });

      api.use(testRouter.routes());

      request
        .get("/some-protected-endpoint")
        .expect(httpStatus.UNAUTHORIZED)
        .end((err, res) => {
          if (err) return callback(err);
          expect(res.body).toMatchObject({
            meta: { duration: expect.any(String), now: expect.any(Number) },
            statusCode: httpStatus.UNAUTHORIZED,
            detail: "Missing x-session-id header",
            msg: "Unauthorized",
            result: null,
          });
          callback();
        });
    });

    test("should skip authentication", (callback) => {
      // close previous server
      server.close();

      // instantiate new api with session validation
      api = createApi(deps, false);
      server = api.listen();
      request = supertest(server);

      // prepare fake session
      deps.sessionService
        .createSession(deps.testUser.email)
        .then((sessionId) => {
          const testRouter = new KoaRouter();

          testRouter.get("/some-protected-endpoint", api.withSession, (ctx) => {
            ctx.body = true;
          });

          api.use(testRouter.routes());

          request
            .get("/some-protected-endpoint")
            .set("X-Session-Id", sessionId)
            .expect(httpStatus.OK)
            .end((err, res) => {
              if (err) return callback(err);
              expect(res.body).toMatchObject({
                meta: { duration: expect.any(String), now: expect.any(Number) },
                statusCode: httpStatus.OK,
                msg: "OK",
                result: true,
              });
              callback();
            });
        });
    });
  });

  describe("Errors", () => {
    test("should handle NotFound error properly", (callback) => {
      request
        .get("/some-wrong-endpoint")
        .expect(httpStatus.NOT_FOUND)
        .end((err, res) => {
          if (err) return callback(err);
          expect(res.body).toMatchObject({
            meta: { duration: expect.any(String), now: expect.any(Number) },
            statusCode: httpStatus.NOT_FOUND,
            msg: "Not Found",
            result: null,
          });
          callback();
        });
    });

    test("should handle ValidationError error properly", (callback) => {
      const testRouter = new KoaRouter();

      testRouter.get("/some-wrong-endpoint", () => {
        throw new ValidatorError("Test validator error");
      });

      api.use(testRouter.routes());

      request
        .get("/some-wrong-endpoint")
        .expect(httpStatus.BAD_REQUEST)
        .end((err, res) => {
          if (err) return callback(err);
          expect(res.body).toMatchObject({
            meta: { duration: expect.any(String), now: expect.any(Number) },
            statusCode: httpStatus.BAD_REQUEST,
            msg: "Bad Request",
            result: null,
          });
          callback();
        });
    });

    test("should handle AuthorizationError error properly", (callback) => {
      const testRouter = new KoaRouter();

      testRouter.get("/some-wrong-endpoint", () => {
        throw new AuthorizationError("Test validator error");
      });

      api.use(testRouter.routes());

      request
        .get("/some-wrong-endpoint")
        .expect(httpStatus.UNAUTHORIZED)
        .end((err, res) => {
          if (err) return callback(err);
          expect(res.body).toMatchObject({
            meta: { duration: expect.any(String), now: expect.any(Number) },
            statusCode: httpStatus.UNAUTHORIZED,
            msg: "Unauthorized",
            result: null,
          });
          callback();
        });
    });

    test("should handle InternalError error properly", (callback) => {
      const testRouter = new KoaRouter();

      testRouter.get("/some-wrong-endpoint", () => {
        throw new BaseError("Test validator error");
      });

      api.use(testRouter.routes());

      request
        .get("/some-wrong-endpoint")
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .end((err, res) => {
          if (err) return callback(err);
          expect(res.body).toMatchObject({
            meta: { duration: expect.any(String), now: expect.any(Number) },
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            msg: "Internal Server Error",
            result: null,
          });
          callback();
        });
    });
  });

  describe("Controllers", () => {
    test("[POST] /v1/auth/sign-in - should instantiate CreateUserSessionController and call CreateUserSessionUseCase", (callback) => {
      expect.assertions(2);
      const body = {
        email: "test@test",
        password: "test123",
      };
      const expectedResult = randomUUID();
      const controller = jest.spyOn(
        CreateUserSessionController.prototype,
        "handle"
      );
      const useCase = jest
        .spyOn(CreateUserSessionUseCase.prototype, "execute")
        .mockImplementation(() => Promise.resolve(expectedResult));
      request
        .post("/v1/auth/sign-in")
        .send(body)
        .end((err) => {
          if (err) throw err;
          expect(controller).toHaveBeenCalled();
          expect(useCase).toHaveBeenCalledWith(body);
          callback();
        });
    });

    test("[POST] /v1/auth/sign-out - should instantiate RemoveUserSessionController and call RemoveUserSessionUseCase", (callback) => {
      expect.assertions(2);
      const controller = jest.spyOn(
        RemoveUserSessionController.prototype,
        "handle"
      );
      const useCase = jest
        .spyOn(RemoveUserSessionUseCase.prototype, "execute")
        .mockImplementation(() => Promise.resolve());
      request
        .post("/v1/auth/sign-out")
        .send()
        .end((err) => {
          if (err) throw err;
          expect(controller).toHaveBeenCalled();
          expect(useCase).toHaveBeenCalledWith({
            email: deps.testUser.email,
            sessionId: expect.any(String),
          });
          callback();
        });
    });

    test("[POST] /v1/records - should instantiate CreateRecordController and call CreateRecordUseCase", (callback) => {
      expect.assertions(2);
      const controller = jest.spyOn(CreateRecordController.prototype, "handle");
      const useCase = jest
        .spyOn(CreateRecordUseCase.prototype, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      const testOperationId = randomUUID();
      request
        .post("/v1/records")
        .send({
          operationArgs: [1, 2],
          operationId: testOperationId,
        })
        .end((err) => {
          if (err) throw err;
          expect(controller).toHaveBeenCalled();
          expect(useCase).toHaveBeenCalledWith({
            operationArgs: [1, 2],
            operationId: testOperationId,
            userId: deps.testUser.id,
          });
          callback();
        });
    });

    test("[GET] /v1/records - should instantiate ListReocrdsController and call ListReocrdsUseCase", (callback) => {
      expect.assertions(2);
      const controller = jest.spyOn(ListRecordsController.prototype, "handle");
      const useCase = jest
        .spyOn(ListRecordsUseCase.prototype, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      const testOperationId = randomUUID();
      request
        .get(
          `/v1/records?operationType=${testOperationId}&limit=1&skip=1&orderBy=asc&sortBy=operationType`
        )
        .end((err) => {
          if (err) throw err;
          expect(controller).toHaveBeenCalled();
          expect(useCase).toHaveBeenCalledWith(
            {
              operationType: testOperationId,
              userId: deps.testUser.id,
            },
            {
              limit: 1,
              skip: 1,
              orderBy: "asc",
              sortBy: "operationType",
            }
          );
          callback();
        });
    });

    test("[DELETE] /v1/record - should instantiate RemoveRecordController and call RemoveRecordUseCase", (callback) => {
      expect.assertions(2);
      const controller = jest.spyOn(RemoveRecordController.prototype, "handle");
      const useCase = jest
        .spyOn(RemoveRecordUseCase.prototype, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      const testRecordId = randomUUID();

      request.del(`/v1/records/${testRecordId}`).end((err) => {
        if (err) throw err;
        expect(controller).toHaveBeenCalled();
        expect(useCase).toHaveBeenCalledWith({
          recordId: testRecordId,
          userId: deps.testUser.id,
        });
        callback();
      });
    });

    test("[GET] /v1/operations - should instantiate ListOperationsController and call ListOperationsUseCase", (callback) => {
      expect.assertions(2);
      const controller = jest.spyOn(
        ListOperationsController.prototype,
        "handle"
      );
      const useCase = jest
        .spyOn(ListOperaitonsUseCase.prototype, "execute")
        .mockImplementation(() => Promise.resolve({} as any));
      request
        .get(`/v1/operations?limit=1&skip=1&orderBy=asc&sortBy=operationType`)
        .end((err) => {
          if (err) throw err;
          expect(controller).toHaveBeenCalled();
          expect(useCase).toHaveBeenCalledWith({
            limit: 1,
            skip: 1,
            orderBy: "asc",
            sortBy: "operationType",
          });
          callback();
        });
    });
  });
});
