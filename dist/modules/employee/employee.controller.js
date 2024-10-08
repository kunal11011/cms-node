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
const employee_service_1 = __importDefault(require("./employee.service"));
const Employee = require("./employee.model");
const JoiValidation = require("../../helpers/validation_schema");
// const EmployeeService = require("./employee.service");
const getAllEmployees = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const employees = await Employee.find({
    //     company: req.body.payload.company,
    //   });
    //   if (employees.length === 0) {
    //     throw createHttpError.NotFound("Employees not found");
    //   }
    //   res.json(employees);
    // } catch (error: any) {
    //   next(error);
    // }
    try {
        const response = yield employee_service_1.default.getAllEmployees(req.body.payload.company, next);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
const getEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const id = req.params.id;
    //   const employee = await Employee.findOne({
    //     _id: id,
    //     company: req.body.payload.company,
    //   });
    //   if (!employee) {
    //     throw createHttpError.NotFound(`Employee with id ${id} not found`);
    //   }
    //   res.json(employee);
    // } catch (error: any) {
    //   next(error);
    // }
    try {
        const response = yield employee_service_1.default.getEmployee(req.params.id, req.body.payload.company, next);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
const getEmployeeHierarchy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const companyId = req.body.payload.company;
    //   const companyAdmin = await Employee.findOne({
    //     company: companyId,
    //     designation: "ADMIN",
    //   });
    //   const employee = await Employee.findById(companyAdmin._id).populate(
    //     "reportsTo"
    //   );
    //   const subordinates = await Employee.find({
    //     reportsTo: companyAdmin._id,
    //   });
    //   const employeeHierarchy = {
    //     ...employee.toObject(),
    //     subordinates,
    //   };
    //   res.json(employeeHierarchy);
    // } catch (error) {
    //   next(error);
    // }
    try {
        const response = yield employee_service_1.default.getEmployeeHierarchy(req.body.payload.company, next);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
const createEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const authPayload = req.body.payload;
    //   if (
    //     !authPayload?.designation ||
    //     authPayload.designation.toLowerCase() !== "admin"
    //   ) {
    //     throw createHttpError.Unauthorized();
    //   }
    //   delete req.body.payload;
    //   const reqBody = await JoiValidation.employeeSchema.validateAsync(req.body);
    //   const doesExist = await Employee.findOne({ email: reqBody.email });
    //   if (doesExist) {
    //     throw createHttpError.Conflict(
    //       `${reqBody.email} is already been registered`
    //     );
    //   }
    //   const employee = new Employee(reqBody);
    //   await employee.save();
    //   res.send(employee);
    // } catch (error: any) {
    //   if (error.isJoi) {
    //     error.status = 422;
    //   }
    //   next(error);
    // }
    try {
        const response = yield employee_service_1.default.createEmployee(req.body.payload, req.body, next);
        console.log("response ==>", response);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
const updateEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   if (req.body.payload) {
    //     delete req.body.payload;
    //   }
    //   const id = req.params.id;
    //   const reqBody = req.body;
    //   const employee = await Employee.findByIdAndUpdate(id, reqBody, {
    //     new: true,
    //   });
    //   if (!employee) {
    //     throw createHttpError.NotFound(`Employee with id ${id} not found`);
    //   }
    //   // const result = await JoiValidation.employeeSchema.validateAsync(employee);
    //   res.json(employee);
    // } catch (error: any) {
    //   if (error.isJoi) {
    //     error.status = 422;
    //   }
    //   next(error);
    // }
    try {
        const response = yield employee_service_1.default.updateEmployee(req.params.id, req.body, next);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
const deleteEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    //   const employee = await Employee.findByIdAndDelete(id);
    //   if (!employee) {
    //     throw createHttpError.NotFound(`Employee with id ${id} not found`);
    //   }
    //   res.json(employee);
    // } catch (error: any) {
    //   next(error);
    // }
    try {
        const response = yield employee_service_1.default.deleteEmployee(req.body.payload, req.params.id, next);
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.default = {
    getAllEmployees,
    getEmployee,
    getEmployeeHierarchy,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};
