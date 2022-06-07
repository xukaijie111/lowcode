import bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';
import  express from 'express';
import { Controller } from './controllers/base.controller'
import { Mongodb} from './mongo/index'
//import errorMiddleware from './middleware/error.middleware';


export class App {
  public app: express.Application;

  constructor({
    controllers,
    mongodb
  }:App.options) {
    
    this.app = express();

    this.connectToTheDatabase(mongodb);
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    //this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller.Meta[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private async connectToTheDatabase(mongodb:Mongodb) {
    await mongodb.init();
  }
}


export namespace App {
    export type options = {
        controllers:Controller.Meta[],
        mongodb:Mongodb
    }
}
