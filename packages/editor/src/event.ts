
export class Event {
    events:Record<string,Array<any>>
    constructor() {
        this.events = {}
    }

    on(name:string,handler:Event.Handler) {
        let list = this.events[name]
        if (!list) {
            list = this.events[name] = []
        }
        if (list.includes(handler)) return this;
        list.push(handler)
        return this;
    }

    emit(name:string,...param:any[]) {
        let list = this.events[name]
        if (!list) return this;
        list.forEach((handler) => {
            handler(...param)
        })
        return this;
    }

    off(name:string,handler?:Event.Handler) {
        if (!name) {
            this.events = {};
            return this;
        }

        if (!handler) {
            return this;
        }

        let list = this.events[name]
        if (!list) return this;
        let index = list.indexOf(handler)
        if (index !== -1) list.splice(index,1)

        return this;
    }

    once(
        name: string,
        handler:Event.Handler
      ) {
        const cb = (...args: any) => {
          this.off(name, cb as any)
          return handler(...args)
        }
    
        return this.on(name, cb as any)
      }
}

export namespace Event {
    export type Handler = (...args:any[]) => void
}