
import { App } from './app';
import { ProcessController } from './controllers/process.controller';
import  { Mongodb }  from './mongo/index';
import { Controller } from './controllers/base.controller'
import * as awilix  from 'awilix'

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
})

container.register({
    processController: awilix.asClass(ProcessController).setLifetime(awilix.Lifetime.SINGLETON),
    mongodb:awilix.asClass(Mongodb).setLifetime(awilix.Lifetime.SINGLETON)
})

let mongodb = container.resolve<Mongodb>('mongodb');
  
mongodb.init()
.then(() => {
    new App( {
        controllers:[
            container.resolve<Controller.Meta>('processController')
        ] as Controller.Meta[]
    });
})

