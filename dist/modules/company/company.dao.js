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
Object.defineProperty(exports, "__esModule", { value: true });
const CompanyModel = require("./company.model");
const saveCompany = (companyData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield companyData.save();
        return company;
    }
    catch (error) {
        return error;
    }
});
const findCompanyByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield CompanyModel.findOne({ email: email });
        return company;
    }
    catch (error) {
        return error;
    }
});
const updateCompany = (id, companyData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield CompanyModel.findByIdAndUpdate(id, companyData, {
            new: true,
        });
        return company;
    }
    catch (error) {
        return error;
    }
});
exports.default = {
    saveCompany,
    findCompanyByEmail,
    updateCompany,
};
