"use strict";
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
const http_errors_1 = __importDefault(require("http-errors"));
const company_dao_1 = __importDefault(require("./company.dao"));
const Company = require("./company.model");
const JoiValidation = require("../../helpers/validation_schema");
// const CompanyDao = require("./company.dao");
const createCompany = (authPayload, reqBody, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(authPayload === null || authPayload === void 0 ? void 0 : authPayload.designation) ||
            authPayload.designation.toLowerCase() !== "admin") {
            next(http_errors_1.default.Unauthorized());
        }
        delete reqBody.payload;
        const validatedBody = yield JoiValidation.companySchema.validateAsync(reqBody);
        const doesExist = yield company_dao_1.default.findCompanyByEmail(validatedBody.email).catch((error) => {
            next(error);
        });
        if (doesExist) {
            next(http_errors_1.default.Conflict(`${validatedBody.name} is already been registered`));
        }
        const company = new Company(Object.assign(Object.assign({}, validatedBody), { createdBy: authPayload.id }));
        const result = yield company_dao_1.default.saveCompany(company).catch((error) => {
            next(error);
        });
        return result;
    }
    catch (error) {
        if (error.isJoi) {
            error.status = 422;
        }
        next(error);
    }
});
const updateCompany = (authPayload, id, reqBody, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(authPayload === null || authPayload === void 0 ? void 0 : authPayload.designation) ||
            authPayload.designation.toLowerCase() !== "admin") {
            next(http_errors_1.default.Unauthorized());
        }
        delete reqBody.payload;
        const company = yield company_dao_1.default.updateCompany(id, reqBody).catch((error) => {
            next(error);
        });
        if (!company) {
            next(http_errors_1.default.NotFound(`Company with id ${id} not found`));
        }
        return company;
    }
    catch (error) {
        if (error.isJoi) {
            error.status = 422;
        }
        next(error);
    }
});
exports.default = {
    createCompany,
    updateCompany,
};
