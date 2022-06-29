


export const  NodeShape = {
    'CUSTOM_RECT' : "custom-rect",
    'CUSTOM_POLYGON' : "custom-polygon"
}


export enum NodeType {
  CHECK = "check",
  COMMON = "common",
  START = "start",
  END = "end"
}
 

export type BaseNodeMetaData = {
    name:string,
    description:string,
    type:string,
    next?:NodeMetaData
}

export interface CheckNodeMetaData extends BaseNodeMetaData {
      type:NodeType.CHECK,
      elseNext?:NodeMetaData
}

export interface StartNodeMetaData extends BaseNodeMetaData {
  type:NodeType.START
}

export interface EndNodeMetaData extends BaseNodeMetaData { 
  type:NodeType.END
}

export interface CommonNodeMetaData extends BaseNodeMetaData { 
  type:NodeType.COMMON
}

export type NodeMetaData = CheckNodeMetaData | StartNodeMetaData | EndNodeMetaData | CommonNodeMetaData


