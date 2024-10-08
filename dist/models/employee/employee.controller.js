"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAllEmployees = (req, res) => {
    res.send("All Employees");
};
const getEmployee = (req, res) => {
    const id = req.params.id;
    res.send(`Employee ${id}`);
};
const getEmployeeHierarchy = (req, res) => {
    res.send(`Employee Hierarchy`);
};
const createEmployee = (req, res) => {
    console.log(req);
    const reqBody = JSON.parse(req.body);
    res.send(`Create Employee \n\n ${reqBody}`);
};
const updateEmployee = (req, res) => {
    const id = req.params.id;
    res.send(`Update Employee ${id}`);
};
const deleteEmployee = (req, res) => {
    const id = req.params.id;
    res.send(`Delete Employee ${id}`);
};
exports.default = { getAllEmployees, getEmployee, getEmployeeHierarchy, createEmployee, updateEmployee, deleteEmployee };
