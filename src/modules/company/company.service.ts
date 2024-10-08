import createHttpError from "http-errors";
import CompanyDao from "./company.dao";
import { NextFunction } from "express";

const Company = require("./company.model");
const JoiValidation = require("../../helpers/validation_schema");
// const CompanyDao = require("./company.dao");

const createCompany = async (
  authPayload: any,
  reqBody: any,
  next: NextFunction
) => {
  try {
    if (
      !authPayload?.designation ||
      authPayload.designation.toLowerCase() !== "admin"
    ) {
      next(createHttpError.Unauthorized());
    }
    delete reqBody.payload;
    const validatedBody = await JoiValidation.companySchema.validateAsync(
      reqBody
    );
    const doesExist = await CompanyDao.findCompanyByEmail(
      validatedBody.email
    ).catch((error: any) => {
      next(error);
    });
    if (doesExist) {
      next(
        createHttpError.Conflict(
          `${validatedBody.name} is already been registered`
        )
      );
    }

    const company = new Company({
      ...validatedBody,
      createdBy: authPayload.id,
    });
    const result = await CompanyDao.saveCompany(company).catch((error: any) => {
      next(error);
    });
    return result;
  } catch (error: any) {
    if (error.isJoi) {
      error.status = 422;
    }
    next(error);
  }
};

const updateCompany = async (
  authPayload: any,
  id: string,
  reqBody: any,
  next: NextFunction
) => {
  try {
    if (
      !authPayload?.designation ||
      authPayload.designation.toLowerCase() !== "admin"
    ) {
      next(createHttpError.Unauthorized());
    }
    delete reqBody.payload;
    const company = await CompanyDao.updateCompany(id, reqBody).catch(
      (error: any) => {
        next(error);
      }
    );
    if (!company) {
      next(createHttpError.NotFound(`Company with id ${id} not found`));
    }
    return company;
  } catch (error: any) {
    if (error.isJoi) {
      error.status = 422;
    }
    next(error);
  }
};

export default {
  createCompany,
  updateCompany,
};
