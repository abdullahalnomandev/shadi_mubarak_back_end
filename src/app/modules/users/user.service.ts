import { User } from './user.model'
import { IUser } from './user.interface'
import { generateUserId } from './user.utils'
import ApiError from '../../../errors/ApiError'

const createUser = async (user: IUser): Promise<IUser | null> => {
  const createUser = await User.create(user)
  if (!createUser) {
    throw new ApiError(400,'Failed to create user')
  }

  if(!user.id){
    const id = await generateUserId();
    user.id = id
  }
  return createUser
}

export const userService =  {
  createUser,
}
