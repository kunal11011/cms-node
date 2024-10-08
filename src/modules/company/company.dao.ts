const CompanyModel = require("./company.model");

const saveCompany = async (companyData: any) => {
  try {
    const company = await companyData.save();
    return company;
  } catch (error: any) {
    return error;
  }
};

const findCompanyByEmail = async (email: string) => {
  try {
    const company = await CompanyModel.findOne({ email: email });
    return company;
  } catch (error: any) {
    return error;
  }
};

const updateCompany = async (id: string, companyData: any) => {
  try {
    const company = await CompanyModel.findByIdAndUpdate(id, companyData, {
      new: true,
    });
    return company;
  } catch (error: any) {
    return error;
  }
};

export default {
  saveCompany,
  findCompanyByEmail,
  updateCompany,
};
