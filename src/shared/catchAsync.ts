import { Request,Response,NextFunction, RequestHandler } from "express"

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};


// const catchAsync = (fn:RequestHandler) => {

//     return async (req:Request,res:Response,next:NextFunction) => {
//         try {
//             fn(req,res,next)
//           } catch (error) {
//             console.log('error - hoice',error)
//             next(error);
//           }

//     }
// }

// export default catchAsync;



export default catchAsync;