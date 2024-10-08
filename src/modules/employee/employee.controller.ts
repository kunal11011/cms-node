import { NextFunction, Request, Response } from "express";
import EmployeeService from "./employee.service";
import createHttpError from "http-errors";

const Employee = require("./employee.model");
const JoiValidation = require("../../helpers/validation_schema");
// const EmployeeService = require("./employee.service");

const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const response = await EmployeeService.getAllEmployees(
      req.body.payload.company,
      next
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
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
    const response = await EmployeeService.getEmployee(
      req.params.id,
      req.body.payload.company,
      next
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getEmployeeHierarchy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const response = await EmployeeService.getEmployeeHierarchy(
      req.body.payload.company,
      next
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const response = await EmployeeService.createEmployee(
      req.body.payload,
      req.body,
      next
    );
    console.log("response ==>", response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const response = await EmployeeService.updateEmployee(
      req.params.id,
      req.body,
      next
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const response = await EmployeeService.deleteEmployee(
      req.body.payload,
      req.params.id,
      next
    );
    res.json(response);
  } catch (error) {
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
