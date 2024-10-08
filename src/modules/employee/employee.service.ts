import createHttpError from "http-errors";
import EmployeeDao from "./employee.dao";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport";
import { NextFunction } from "express";
import mongoose from "mongoose";
import { report } from "process";
import { lstat } from "fs";

const Employee = require("./employee.model");
const JoiValidation = require("../../helpers/validation_schema");
// const EmployeeDao = require("./employee.dao");
const logger = require("../../logger");

const getAllEmployees = async (companyId: any, next: NextFunction) => {
  try {
    const employees = await EmployeeDao.getAllEmployees(companyId);
    if (employees.length === 0) {
      throw createHttpError.NotFound("Employees not found");
    }
    return employees;
  } catch (error: any) {
    next(error);
  }
};

const getEmployee = async (
  id: string,
  companyId: string,
  next: NextFunction
) => {
  try {
    // const id = req.params.id;
    // const employee = await Employee.findOne({
    //   _id: id,
    //   company: req.body.payload.company,
    // });
    const employee = await EmployeeDao.getEmployeesByFilter({
      _id: id,
      company: companyId,
    });
    if (!employee) {
      throw createHttpError.NotFound(`Employee with id ${id} not found`);
    }
    return employee;
  } catch (error: any) {
    next(error);
  }
};

const getEmployeeHierarchy = async (companyId: string, next: NextFunction) => {
  try {
    // const companyId = req.body.payload.company;
    const companyAdmin = await EmployeeDao.getEmployeesByFilter({
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

    const employeeHierarchy = await getHierarchy(companyAdmin._id, next);

    return employeeHierarchy;
  } catch (error) {
    next(error);
  }
};

const getHierarchy = async (employeeId: string, next: NextFunction) => {
  try {
    const employee = await Employee.findById(
      employeeId,
      "firstName lastName designation reportsTo"
    );

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Find all subordinates
    const subordinates = await Employee.find(
      {
        reportsTo: employeeId,
      },
      "firstName lastName designation reportsTo"
    );

    // Use Promise.all to wait for all recursive calls
    const subordinatesWithHierarchy = await Promise.all(
      subordinates.map(async (emp: any) => {
        const hierarchy = await getHierarchy(emp._id.toString(), next);

        return hierarchy ? hierarchy : [];
      })
    );

    const employeeHierarchy = {
      ...employee.toObject(),
      subordinates: subordinatesWithHierarchy,
    };

    return employeeHierarchy;
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (
  authPayload: any,
  reqBody: any,
  next: NextFunction
) => {
  try {
    // const authPayload = req.body.payload;
    if (
      !authPayload?.designation ||
      authPayload.designation.toLowerCase() !== "admin"
    ) {
      throw createHttpError.Unauthorized();
    }
    delete reqBody.payload;

    const validatedBody = await JoiValidation.employeeSchema.validateAsync(
      reqBody
    );
    const doesExist = await EmployeeDao.getEmployeesByFilter({
      company: authPayload.company,
      email: validatedBody.email,
    }).catch((error: any) => {
      throw error;
    });

    if (doesExist) {
      throw createHttpError.Conflict(
        `${validatedBody.email} is already been registered`
      );
    }

    const employee = new Employee(validatedBody);
    const savedEmployee = await EmployeeDao.createEmployee(employee).catch(
      (error: any) => {
        throw error;
      }
    );

    return savedEmployee;
  } catch (error: any) {
    if (error.isJoi) {
      error.status = 422;
      error.message = error.details[0].message;
      next({ status: error.status, message: error.message });
    }
    next(error);
  }
};

const updateEmployee = async (id: string, reqBody: any, next: NextFunction) => {
  try {
    if (reqBody.payload) {
      delete reqBody.payload;
    }
    // const id = req.params.id;
    // const reqBody = reqBody;

    const employee = await EmployeeDao.updateEmployee(id, reqBody);
    if (!employee) {
      throw createHttpError.NotFound(`Employee with id ${id} not found`);
    }
    // const result = await JoiValidation.employeeSchema.validateAsync(employee);
    return employee;
  } catch (error: any) {
    if (error.isJoi) {
      error.status = 422;
    }
    next(error);
  }
};

const deleteEmployee = async (
  authPayload: any,
  id: any,
  next: NextFunction
) => {
  try {
    // const authPayload = req.body.payload;
    if (
      !authPayload?.designation ||
      authPayload.designation.toLowerCase() !== "admin"
    ) {
      throw createHttpError.Unauthorized();
    }
    // const id = req.params.id;

    const employee = await EmployeeDao.deleteEmployee(id);
    if (!employee) {
      throw createHttpError.NotFound(`Employee with id ${id} not found`);
    }
    return employee;
  } catch (error: any) {
    next(error);
  }
};

export default {
  getAllEmployees,
  getEmployee,
  getEmployeeHierarchy,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
