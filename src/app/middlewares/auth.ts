import { NextFunction, Request, Response } from 'express';
const auth = (...requireRoles:string[]) => async (req:Request, res:Response, next:NextFunction) => 

{
    const {role} = req.body;
    
    if(!requireRoles.includes(role)){
        return res.status(403).json({
            success:false,
            message:"Forbidden"
        })
    }
    next();
}

export default auth;