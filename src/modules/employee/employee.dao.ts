const EmployeeSchema = require("./employee.model");

const createEmployee = async (employee: any) => {
  const employeeCreated = await employee.save();
  return employeeCreated;
};

const getAllEmployees = async (companyId: any) => {
  const employees = await EmployeeSchema.find({
    company: companyId,
  });
  return employees;
};

const getEmployeesByFilter = async (filter: any) => {
  const employees = await EmployeeSchema.findOne(filter);
  return employees;
};

const getHierarchy = async (filter: any, fields: string = "") => {
  const employees = await EmployeeSchema.find(filter, fields);
  return employees;
};

const updateEmployee = async (id: string, employee: any) => {
  const employeeUpdated = await EmployeeSchema.findByIdAndUpdate(id, employee, {
    new: true,
  });
  return employeeUpdated;
};

const deleteEmployee = async (id: string) => {
  const employeeDeleted = await EmployeeSchema.findByIdAndDelete(id);
  return employeeDeleted;
};

export default {
  createEmployee,
  getAllEmployees,
  getEmployeesByFilter,
  //   getEmployeeById,
  //   getEmployeeByEmail,
  updateEmployee,
  deleteEmployee,
  getHierarchy,
};
