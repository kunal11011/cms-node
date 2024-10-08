import { NextFunction, Request, Response } from "express";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport";
import createHttpError from "http-errors";
import CompanyService from "./company.service";

const Company = require("./company.model");
const JoiValidation = require("../../helpers/validation_schema");
// const CompanyService = require("./company.service");

const createCompany = async (
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
    const response = await CompanyService.createCompany(
      authPayload,
      req.body,
      next
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (
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
    const response = await CompanyService.updateCompany(
      authPayload,
      req.params.id,
      req.body,
      next
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export default {
  createCompany,
  updateCompany,
};
