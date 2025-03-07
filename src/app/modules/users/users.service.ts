import { Request, Response } from 'express'
import { User } from './users.model'
import { IUser } from './users.interface'

const createUser = async (user: IUser): Promise<IUser | null> => {
  const createUser = await User.create(user)
  if (!createUser) {
    throw new Error('Failed to create user')
  }

  return createUser
}

export default {
  createUser,
}
