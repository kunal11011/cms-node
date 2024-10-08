"use strict";
// import Joi from "joi";
const Joi = require("joi");
const employeeSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().lowercase().email(),
    password: Joi.string()
        .required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    designation: Joi.string()
        .required()
        .valid("ADMIN", "REPORTING_MANAGER", "DEVELOPER"),
    company: Joi.string().required().hex().length(24),
    verified: Joi.boolean().default(false),
    reportsTo: Joi.string().hex().length(24),
});
const companySchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().lowercase().email(),
    address: Joi.object({
        line1: Joi.string().required(),
        line2: Joi.string(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        zip: Joi.string()
            .length(6)
            .pattern(/^[0-9]+$/)
            .required(),
    }),
    contact: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    createdBy: Joi.string().hex().length(24),
});
const userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().lowercase().email(),
    password: Joi.string()
        .required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    company: companySchema,
});
const userLoginSchema = Joi.object({
    email: Joi.string().required().lowercase().email(),
    password: Joi.string()
        .required()
        .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
});
module.exports = { employeeSchema, companySchema, userSchema, userLoginSchema };
