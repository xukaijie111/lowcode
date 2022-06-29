import * as bodyParser from 'body-parser';

import * as cookieParser from 'cookie-parser';
import  * as express from 'express';
import { Controller } from './controllers/base.controller'
import { Mongodb} from './mongo/index'
import corsMiddleware from "./middleware/cors.middleware"
//import errorMiddleware from './middleware/error.middleware';

export interface IResponse<T = unknown,U = unknown> extends express.Response {
    ok:(arg0: T) =>  U
    fail:(arg0: T) => U
} 

const PORT = 3456
export class App {
  public app: express.Application;

   constructor({
    controllers,
  }:App.options) {
    
    this.app = express();

      this.initializeMiddlewares();
      this.initializeControllers(controllers);
      this.initializeErrorHandling();
      this.listen();
    
   
  }

  public listen() {
    this.app.listen(PORT, () => {
      console.log(`App listening on the port ${PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(corsMiddleware);
  }

  private initializeErrorHandling() {
    //this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller.Meta[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}


export namespace App {
    export type options = {
        controllers:Controller.Meta[]
    }
}
