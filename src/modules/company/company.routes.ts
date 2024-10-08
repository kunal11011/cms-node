import { Router } from "express";
import CompanyController from "./company.controller";

const router = Router();

router.post("/", CompanyController.createCompany);

router.patch("/:id", CompanyController.updateCompany);

module.exports = router;
