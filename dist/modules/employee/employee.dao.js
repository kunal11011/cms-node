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
const EmployeeSchema = require("./employee.model");
const createEmployee = (employee) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeCreated = yield employee.save();
    return employeeCreated;
});
const getAllEmployees = (companyId) => __awaiter(void 0, void 0, void 0, function* () {
    const employees = yield EmployeeSchema.find({
        company: companyId,
    });
    return employees;
});
const getEmployeesByFilter = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const employees = yield EmployeeSchema.findOne(filter);
    return employees;
});
const getHierarchy = (filter_1, ...args_1) => __awaiter(void 0, [filter_1, ...args_1], void 0, function* (filter, fields = "") {
    const employees = yield EmployeeSchema.find(filter, fields);
    return employees;
});
const updateEmployee = (id, employee) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeUpdated = yield EmployeeSchema.findByIdAndUpdate(id, employee, {
        new: true,
    });
    return employeeUpdated;
});
const deleteEmployee = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeDeleted = yield EmployeeSchema.findByIdAndDelete(id);
    return employeeDeleted;
});
exports.default = {
    createEmployee,
    getAllEmployees,
    getEmployeesByFilter,
    //   getEmployeeById,
    //   getEmployeeByEmail,
    updateEmployee,
    deleteEmployee,
    getHierarchy,
};
