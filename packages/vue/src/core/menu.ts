
import _ from 'lodash'
export class GraphMenu {
    private menus: typeof GraphMenu.menus
    constructor() {
        this.menus = GraphMenu.menus;
    }

    getMenus() {
        return this.menus;
    }

    getMenuItemById(id: number | string) {
        id = parseInt(id as string)

        let children: Array<GraphMenu.CellItem> = []

        children = this.menus.reduce((prev: Array<GraphMenu.CellItem>, now) => {
            prev = prev.concat(now?.children)
            return prev
        }, [])

        let item = _.find(children, { id })

        return item
    }
}


export namespace GraphMenu {
    export type CellItem = {
        id: number,
        name: string,
        shape: string,
        attrs: Record<any, any>
        data: Record<any, any>
        ports: Record<any, any>
    }
    export const menus = [
        {
            name: "普通元件",
            children: [
                {
                    id: 1,
                    x: 60,
                    y: 60,
                    width: 160,
                    height: 80,
                    label: 'Rect With Ports',
                    ports: [
                      { id: 'port1' }, 
                      { id: 'port2' }, 
                      { id: 'port3' },
                    ],

                }
            ]
        }
    ]
}