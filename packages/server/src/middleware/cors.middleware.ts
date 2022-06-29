import { NextFunction, Request, Response } from 'express';
import { IResponse } from '../app'


function corsMiddleware(request: Request, response: IResponse, next: NextFunction) {
 
    response.header("Access-Control-Allow-Origin", "http://localhost:3000")

    // res.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, isfrom');
    response.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    response.header('Access-Control-Allow-Credentials','true')
    
    if (request.method == 'OPTIONS') {
        response.send(200); 
    }
    else {
        response.ok = function(data) {
        return response.json({success:true,data})
      }
    
      response.fail = function(error) {
        return response.json({success:false,errorMsg:error})
      }
    
      next();
}
}

export default corsMiddleware;
