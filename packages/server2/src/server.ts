
import { App } from './app';
import { ProcessController } from './controllers/process.controller';
import  { Mongodb } from './mongo/index';
import { Controller } from './controllers/base.controller'
import awilix  from 'awilix'

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
})

container.register({
    ProcessController: awilix.asClass(ProcessController).setLifetime(awilix.Lifetime.SINGLETON),
    Mongodb:awilix.asClass(Mongodb).setLifetime(awilix.Lifetime.SINGLETON)
})
  


const app = new App( {

    controllers:[
        container.resolve<Controller.Meta>('ProcessController')
    ] as Controller.Meta[],


    mongodb: container.resolve<Mongodb>('Mongodb')
});

app.listen();
