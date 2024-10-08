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
const company_service_1 = __importDefault(require("./company.service"));
const Company = require("./company.model");
const JoiValidation = require("../../helpers/validation_schema");
// const CompanyService = require("./company.service");
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const authPayload = req.body.payload;
    //   if (
    //     !authPayload?.designation ||
    //     authPayload.designation.toLowerCase() !== "admin"
    //   ) {
    //     throw createHttpError.Unauthorized();
    //   }
    //   delete req.body.payload;
    //   const reqBody = await JoiValidation.companySchema.validateAsync(req.body);
    //   const doesExist = await Company.findOne({ email: reqBody.email });
    //   if (doesExist) {
    //     throw createHttpError.Conflict(
    //       `${reqBody.name} is already been registered`
    //     );
    //   }
    //   const company = new Company({ ...reqBody, createdBy: authPayload.id });
    //   const result = await company.save();
    //   res.send(result);
    // } catch (error: any) {
    //   if (error.isJoi) {
    //     error.status = 422;
    //   }
    //   next(error);
    // }
    try {
        const authPayload = req.body.payload;
        const response = yield company_service_1.default.createCompany(authPayload, req.body, next);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
const updateCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const authPayload = req.body.payload;
    //   if (
    //     !authPayload?.designation ||
    //     authPayload.designation.toLowerCase() !== "admin"
    //   ) {
    //     throw createHttpError.Unauthorized();
    //   }
    //   delete req.body.payload;
    //   const id = req.params.id;
    //   const reqBody = req.body;
    //   const company = await Company.findByIdAndUpdate(id, reqBody, {
    //     new: true,
    //   });
    //   if (!company) {
    //     throw createHttpError.NotFound(`Company with id ${id} not found`);
    //   }
    //   res.json(company);
    // } catch (error: any) {
    //   if (error.isJoi) {
    //     error.status = 422;
    //   }
    //   next(error);
    // }
    try {
        const authPayload = req.body.payload;
        const response = yield company_service_1.default.updateCompany(authPayload, req.params.id, req.body, next);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    createCompany,
    updateCompany,
};
