"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = __importDefault(require("./employee.controller"));
const router = (0, express_1.Router)();
router.get("/", employee_controller_1.default.getAllEmployees);
router.get("/hierarchy", employee_controller_1.default.getEmployeeHierarchy);
router.get("/:id", employee_controller_1.default.getEmployee);
router.post("/", employee_controller_1.default.createEmployee);
router.put("/:id", employee_controller_1.default.updateEmployee);
router.delete("/:id", employee_controller_1.default.deleteEmployee);
module.exports = router;
