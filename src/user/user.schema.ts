import * as mongoose from 'mongoose';

import { RoleIdCollection, User } from './user.interface';

export const UserSchema = new mongoose.Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    address: { type: String, required: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: { type: Boolean, default: false },
    activationToken: String,
    activationExpires: Date,
    roles: [String],
    phone: { type: String, required: false },
    designation: { type: String, required: false },
    department: { type: String, required: false },
    companyName:{ type: String, required: false }, 
    masterName:{ type: String, required: false },
    employeeId:{ type: String, required: false, unique: true},
    column:{ type: String, required: false },
    reportingManager:{ type: String, required: false },
    appName:[String]
  },
  { timestamps: true },
);

/**
 * Methods.
 */
UserSchema.methods.getPublicData = function () {
  const { id, email, isActive, roles, firstName, lastName, address, phone, designation, department, companyName,employeeId} = this;
  return { id, email, isActive, roles, firstName, lastName, address, phone, designation, department,companyName,employeeId };
};


export const userRoleIdSchema = new mongoose.Schema<RoleIdCollection>(
  {
    userId: { type: String, required: true },
    roleName: { type: String, required: true },
  },
  { timestamps: true },
);
