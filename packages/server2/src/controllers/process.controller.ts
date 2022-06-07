import { Request, Response, NextFunction, Router } from 'express';
import { Mongodb } from '../mongo/index'

export  class ProcessController {
    public path = "/process";
    public router:Router = Router();
    private Mongodb:Mongodb

    constructor({
        Mongodb
    }) {
        this.Mongodb = Mongodb;
    }
}

