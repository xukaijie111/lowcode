import { BasicNode } from "./basic.node";
import _ from 'lodash';

export class CircleNode extends BasicNode {
    constructor(options:BasicNode.options) {

        super(_.merge(CircleNode.defaultOptions,options))
    }

    public getShape() {



    }


}

export namespace CircleNode {

    export const defaultOptions :  Partial<BasicNode.options>= {
        width:50,
        height:50,
        attrs:{

        },
        text:{
            label:"",
            attrs:{

            }
        },
        ports:{
            items:[
                {
                    id:"in",
                    rule:(s,t) => s.getId() !== t.getId()
                }
            ]
        }
    }
}