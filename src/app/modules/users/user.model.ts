/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';

const UserSchema = new Schema<IUser, UserModel>(
  {
    bioDataNo: { type: String, unique: true, required: true },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Password is required'],
    },
    phone: {
      type: String,
      select: false,
      required: [true, 'phone is required'],
    },
    role: {
      type: String,
      enum: [
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.USER,
      ],
      default: ENUM_USER_ROLE.USER,
    },
    bioData: {
      type: Schema.Types.ObjectId,
      ref: 'BioData',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.static('isUserExist', async function (email: string): Promise<Pick<
  IUser,
  'email' | 'password' | 'bioDataNo' | 'role'
> | null> {
  return await User.findOne(
    { email },
    { email: 1, password: 1, role: 1, bioDataNo: 1 }
  );
});

UserSchema.static(
  'isPasswordMatch',
  async function (
    givenPassword: string,
    savePassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(givenPassword, savePassword);
  }
);

// hashing password
UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hashSync(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
