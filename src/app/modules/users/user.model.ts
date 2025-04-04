/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const UserSchema = new Schema<IUser,UserModel>(
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

UserSchema.static('isUserExist', async function (email:string):Promise<Pick<IUser,"email" | "password" | "id" | "role"> | null>{
  return await User.findOne({email},{email:1,password:1,role:1,id:1});
})

UserSchema.static('isPasswordMatch', async function (givenPassword:string,savePassword:string):Promise<boolean>{
  return  await bcrypt.compare(givenPassword,savePassword);
})

UserSchema.pre('save', async function (next) {
    const user = this
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_round)
    );
  next();
});


export const User = model<IUser, UserModel>('User', UserSchema);
