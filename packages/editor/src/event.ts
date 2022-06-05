

export class Event {
    events: Record<string, Array<Event.Handler>>
    constructor() {
        this.events = {}
    }
    on(name: string, handler: Event.Handler) {
        let handlers = this.events[name];

        if (handlers) {
            if (handlers.includes(handler)) return this;
        } else {
            handlers = this.events[name] = []
        }

        handlers.push(handler)
        return this;
    }

    emit(name: string, ...args: any[]) {
        let handlers = this.events[name];
        if (!handlers || !handlers.length) return this;

        handlers.forEach((handler) => {
            handler(...args)
        })

        return this;
    }

    off(name:string,handler?:Event.Handler) {
        let handlers = this.events[name];
        if (!handlers || !handlers.length) return this;
        if (handler) {
            let index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index,1)
            }
        }else {
            this.events[name] = []
        }

        return this;
    }

}


export namespace Event {

    export type Handler = (...arg: any) => any

    export type Args = Array<any>


}