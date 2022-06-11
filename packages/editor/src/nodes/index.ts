


import {
    CircleNode
} from './circle.node'

import {
    BasicNode
} from './basic.node'

import {
    DiamondNode
} from './diamond.node'

import {
    RectNode
} from './rect.node'

let shapeMap:Record<any,any> = {
    'rect':RectNode,
    'circle':CircleNode,
    'diamond':DiamondNode
}


export function registerNode<T extends BasicNode> ({ type, Ctor}: {type:string,Ctor:T}) {

    let keys = Object.keys(shapeMap)
    if (keys.includes(type)) {
        console.warn(`register node ${type} has been in manodo/editor`)
        return;
    }

    shapeMap[type] = Ctor;
    return true;
}

export function getShapeMap() {
    return shapeMap;
}