"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Operation_1 = require("@/core/entities/Operation");
const User_1 = __importStar(require("@/core/entities/User"));
const PrismaOperationsRepository_1 = __importDefault(require("@/infrastructure/database/PrismaOperationsRepository"));
const PrismaUsersRepository_1 = __importDefault(require("@/infrastructure/database/PrismaUsersRepository"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const userRepository = new PrismaUsersRepository_1.default(prisma);
        const operationRepository = new PrismaOperationsRepository_1.default(prisma);
        const user = new User_1.default({
            balance: 200,
            email: "test@test",
            status: User_1.UserStatus.ACTIVE,
        });
        yield user.setPassword("test123");
        const user2 = new User_1.default({
            balance: 2000,
            email: "test2@test",
            status: User_1.UserStatus.ACTIVE,
        });
        yield user2.setPassword("test1234");
        yield Promise.all([
            userRepository.create(user),
            userRepository.create(user2),
            operationRepository.create({
                cost: 20.5,
                type: Operation_1.OperationType.ADDITION,
            }),
            operationRepository.create({
                cost: 10.0,
                type: Operation_1.OperationType.SUBTRACTION,
            }),
            operationRepository.create({
                cost: 100.0,
                type: Operation_1.OperationType.SQUARE_ROOT,
            }),
            operationRepository.create({
                cost: 1.35,
                type: Operation_1.OperationType.RANDOM_STRING,
            }),
            operationRepository.create({
                cost: 15.37,
                type: Operation_1.OperationType.DIVISION,
            }),
            operationRepository.create({
                cost: 23.8,
                type: Operation_1.OperationType.MULTIPLICATION,
            }),
            operationRepository.create({
                cost: 48.33,
                type: Operation_1.OperationType.RANDOM_STRING_V2,
            }),
        ]);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
