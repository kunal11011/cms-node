"use strict";
// import mongoose, { Schema } from "mongoose";
// import bcrypt from "bcrypt";
// const UserSchema = new Schema({
//   firstName: {
//     type: String,
//     required: true,
//   },
//   lastName: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   company: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
// });
// const SignInSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });
// UserSchema.pre("save", async function (next: any) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(this.password, salt);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
// UserSchema.methods.comparePassword = async function (
//   password: string,
//   next: any
// ) {
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     next(error);
//   }
// };
// const userSchema = mongoose.model("User", UserSchema);
// const signInSchema = mongoose.model("SignIn", SignInSchema);
// module.exports = { userSchema, signInSchema };
// const signInSchema = new Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });
