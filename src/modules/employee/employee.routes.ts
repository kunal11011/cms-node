import { Router } from "express";
import EmployeeController from "./employee.controller";

const router = Router();

router.get("/", EmployeeController.getAllEmployees);

router.get("/hierarchy", EmployeeController.getEmployeeHierarchy);

router.get("/:id", EmployeeController.getEmployee);

router.post("/", EmployeeController.createEmployee);

router.put("/:id", EmployeeController.updateEmployee);

router.delete("/:id", EmployeeController.deleteEmployee);

module.exports = router;
