import { Request, Response, NextFunction } from 'express';





const isAuthenticated = (req:Request, res:Response, next:NextFunction) => {
    if (req.session.user){ 
        next();
    }
    else {
        res.redirect('/users/login')
        // next('route')
    }
}

export default isAuthenticated;