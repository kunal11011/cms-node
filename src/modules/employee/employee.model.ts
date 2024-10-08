import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const EmployeeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    enum: ["ADMIN", "REPORTING_MANAGER", "DEVELOPER"],
    // required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  reportsTo: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

EmployeeSchema.pre("save", async function (next: any) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

EmployeeSchema.methods.comparePassword = async function (
  password: string,
  next: any
) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    next(error);
  }
};

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
