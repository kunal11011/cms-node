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
const employee_dao_1 = __importDefault(require("./employee.dao"));
const Employee = require("./employee.model");
const JoiValidation = require("../../helpers/validation_schema");
// const EmployeeDao = require("./employee.dao");
const logger = require("../../logger");
const getAllEmployees = (companyId, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employee_dao_1.default.getAllEmployees(companyId);
        if (employees.length === 0) {
            throw http_errors_1.default.NotFound("Employees not found");
        }
        return employees;
    }
    catch (error) {
        next(error);
    }
});
const getEmployee = (id, companyId, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const id = req.params.id;
        // const employee = await Employee.findOne({
        //   _id: id,
        //   company: req.body.payload.company,
        // });
        const employee = yield employee_dao_1.default.getEmployeesByFilter({
            _id: id,
            company: companyId,
        });
        if (!employee) {
            throw http_errors_1.default.NotFound(`Employee with id ${id} not found`);
        }
        return employee;
    }
    catch (error) {
        next(error);
    }
});
const getEmployeeHierarchy = (companyId, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const companyId = req.body.payload.company;
        const companyAdmin = yield employee_dao_1.default.getEmployeesByFilter({
            company: companyId,
            designation: "ADMIN",
        });
        // const employee = await Employee.findById(
        //   companyAdmin._id,
        //   "firstName designation reportsTo"
        // ).populate("reportsTo");
        // const subordinates = await EmployeeDao.getHierarchy(
        //   {
        //     reportsTo: companyAdmin._id,
        //   },
        //   "firstName designation reportsTo"
        // );
        // const employee = await Employee.findById(
        //   companyAdmin._id,
        //   "firstName designation reportsTo"
        // ).populate("reportsTo");
        // const subordinates = await Employee.find(
        //   {
        //     reportsTo: employee._id,
        //   },
        //   "firstName designation reportsTo"
        // );
        // const employeeHierarchy = {
        //   ...employee.toObject(),
        //   subordinates,
        // };
        //  OLD CODE
        // const employeeHierarchy = Employee.aggregate([
        //   {
        //     $match: {
        //       company: new mongoose.Types.ObjectId(companyId),
        //       reportsTo: null,
        //     },
        //   },
        //   {
        //     $graphLookup: {
        //       from: "employees",
        //       startWith: "$_id",
        //       connectFromField: "_id",
        //       connectToField: "reportsTo",
        //       as: "reportees",
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       firstName: 1,
        //       lastName: 1,
        //       designation: 1,
        //       reportsTo: 1,
        //       // subordinates: 1,
        //       reportees: {
        //         $map: {
        //           input: "$reportees",
        //           as: "reportee",
        //           in: {
        //             _id: "$$reportee._id",
        //             firstName: "$$reportee.firstName",
        //             designation: "$$reportee.designation",
        //             reportsTo: "$$reportee.reportsTo",
        //             reportees: [],
        //           },
        //         },
        //       },
        //     },
        //   },
        // ]);
        // NEW CODE 1
        // const employeeHierarchy = Employee.aggregate(
        //   [
        //     {
        //       // Step 1: Match the top-level employees (ADMIN)
        //       $match: {
        //         company: new mongoose.Types.ObjectId(companyId),
        //         // reportsTo: null, // Start with the top-level employee
        //       },
        //     },
        //     {
        //       // Step 2: Recursively lookup the reportees (subordinates) using $graphLookup
        //       $graphLookup: {
        //         from: "employees",
        //         startWith: "$_id",
        //         connectFromField: "_id",
        //         connectToField: "reportsTo",
        //         as: "allSubordinates",
        //         depthField: "depth", // Optional: Track the depth of each reportee
        //       },
        //     },
        // {
        //   $addFields: {
        //     subordinates: [
        //       {
        //         $map: {
        //           input: {
        //             $filter: {
        //               input: "$allSubordinates",
        //               as: "subordinate",
        //               cond: { $eq: ["$$subordinate.reportsTo", "$_id"] },
        //             },
        //           },
        //           as: "directSub",
        //           in: {
        //             $mergeObjects: [
        //               "$$directSub",
        //               {
        //                 subordinates:
        //                 // [
        //                   {
        //                     $filter: {
        //                       input: "$allSubordinates",
        //                       as: "sub",
        //                       cond: {
        //                         $eq: ["$$sub.reportsTo", "$directSub._id"],
        //                       },
        //                     },
        //                   },
        //                 //   {
        //                 //     $project: {
        //                 //       _id: 1,
        //                 //       firstName: 1,
        //                 //       lastName: 1,
        //                 //       designation: 1,
        //                 //       subordinates: 1,
        //                 //       reportsTo: 1,
        //                 //     },
        //                 //   },
        //                 // ],
        //               },
        //             ],
        //           },
        //         },
        //       },
        //     ],
        //   },
        // },
        // {
        //   // Step 4: Final projection to get the required fields
        //   $project: {
        //     _id: 1,
        //     firstName: 1,
        //     lastName: 1,
        //     designation: 1,
        //     subordinates: 1,
        //     reportsTo: 1,
        //   },
        // },
        //   ],
        //   {
        //     allowDiskUse: true,
        //   }
        // );
        // console.log("employeeHierarchy ===>", employeeHierarchy);
        const employeeHierarchy = yield getHierarchy(companyAdmin._id, next);
        return employeeHierarchy;
    }
    catch (error) {
        next(error);
    }
});
const getHierarchy = (employeeId, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield Employee.findById(employeeId, "firstName lastName designation reportsTo");
        if (!employee) {
            throw new Error("Employee not found");
        }
        // Find all subordinates
        const subordinates = yield Employee.find({
            reportsTo: employeeId,
        }, "firstName lastName designation reportsTo");
        // Use Promise.all to wait for all recursive calls
        const subordinatesWithHierarchy = yield Promise.all(subordinates.map((emp) => __awaiter(void 0, void 0, void 0, function* () {
            const hierarchy = yield getHierarchy(emp._id.toString(), next);
            return hierarchy ? hierarchy : [];
        })));
        const employeeHierarchy = Object.assign(Object.assign({}, employee.toObject()), { subordinates: subordinatesWithHierarchy });
        return employeeHierarchy;
    }
    catch (error) {
        next(error);
    }
});
const createEmployee = (authPayload, reqBody, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const authPayload = req.body.payload;
        if (!(authPayload === null || authPayload === void 0 ? void 0 : authPayload.designation) ||
            authPayload.designation.toLowerCase() !== "admin") {
            throw http_errors_1.default.Unauthorized();
        }
        delete reqBody.payload;
        const validatedBody = yield JoiValidation.employeeSchema.validateAsync(reqBody);
        const doesExist = yield employee_dao_1.default.getEmployeesByFilter({
            company: authPayload.company,
            email: validatedBody.email,
        }).catch((error) => {
            throw error;
        });
        if (doesExist) {
            throw http_errors_1.default.Conflict(`${validatedBody.email} is already been registered`);
        }
        const employee = new Employee(validatedBody);
        const savedEmployee = yield employee_dao_1.default.createEmployee(employee).catch((error) => {
            throw error;
        });
        return savedEmployee;
    }
    catch (error) {
        if (error.isJoi) {
            error.status = 422;
            error.message = error.details[0].message;
            next({ status: error.status, message: error.message });
        }
        next(error);
    }
});
const updateEmployee = (id, reqBody, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (reqBody.payload) {
            delete reqBody.payload;
        }
        // const id = req.params.id;
        // const reqBody = reqBody;
        const employee = yield employee_dao_1.default.updateEmployee(id, reqBody);
        if (!employee) {
            throw http_errors_1.default.NotFound(`Employee with id ${id} not found`);
        }
        // const result = await JoiValidation.employeeSchema.validateAsync(employee);
        return employee;
    }
    catch (error) {
        if (error.isJoi) {
            error.status = 422;
        }
        next(error);
    }
});
const deleteEmployee = (authPayload, id, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const authPayload = req.body.payload;
        if (!(authPayload === null || authPayload === void 0 ? void 0 : authPayload.designation) ||
            authPayload.designation.toLowerCase() !== "admin") {
            throw http_errors_1.default.Unauthorized();
        }
        // const id = req.params.id;
        const employee = yield employee_dao_1.default.deleteEmployee(id);
        if (!employee) {
            throw http_errors_1.default.NotFound(`Employee with id ${id} not found`);
        }
        return employee;
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
