/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser,Record<string,unknown>, IUserMethods>(
  {
    id: { type: String, required: [true, 'ID is required'] },
    email: { type: String, required: [true, 'email is required'] },
    password: {
      type: String,
      required: [true, 'password is required to create user'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);


UserSchema.methods.isUserExist = async function(email: string):Promise<Partial<IUser> | null>{
 return User.findOne({email},{email:1,password:1});
}

UserSchema.methods.isPasswordMatch = async function (givenPassword,savePassword):Promise<boolean>{
  return  await bcrypt.compare(givenPassword,savePassword);
}

UserSchema.pre('save', async function (next) {
    const user = this
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round)
    );
  next();
});


export const User = model<IUser, UserModel>('User', UserSchema);
