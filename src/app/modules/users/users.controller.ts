import { Request , Response } from "express"
import { userService } from "./users.service"

const createUser = async (req:Request, res:Response) => {

  try {
    const {user} = req.body;
    const result = await userService.createUser(user);
    res.status(200).json({
        status:"success",
        message:"User created successfully",
        data: result
    })

  } catch (error) {
    res.status(400).json({
        status:"fail",
        message:'Failed to create user'
    })
  }

}


export const UserController = {
    createUser
}