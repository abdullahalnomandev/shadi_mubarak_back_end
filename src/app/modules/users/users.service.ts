import { User } from './users.model'
import { IUser } from './users.interface'
import { generateUserId } from './user.utils'

const createUser = async (user: IUser): Promise<IUser | null> => {
  const createUser = await User.create(user)
  if (!createUser) {
    throw new Error('Failed to create user')
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
