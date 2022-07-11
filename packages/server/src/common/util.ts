

import { parse } from "@babel/parser"
import traverse from "@babel/traverse"

import {
  NodeShape,
  NodeType,
  CheckNodeMetaData,
  StartNodeMetaData,
  EndNodeMetaData,
  CommonNodeMetaData,
  NodeMetaData
} from '@lowcode/shared'

let fse  = require('fs-extra');


export function generateId(len = 10) {
  let s = ""
  while (len--) {
    s += Math.round(Math.random() * 10);
  }
  return s
}


export function getAst(source:string) {
  console.log(`getast source is `,source);
    try {
        return parse(source, { sourceType: 'module' });
    } catch (error) {
      console.log(error)
      return;
    }
}


export function parseDependency(source:string) {

  function isNpmPackage(value:string) {

    return /^[a-z]/.test(value)
  }


  try {
    let ret = [];
    const ast = parse(source, { sourceType: 'module' })

    //@ts-ignore
    traverse(ast, {
      enter: path => {
        if (path.node.type === 'ImportDeclaration') {
          let { node } = path;
          let { source: { value } } = node;
          if (isNpmPackage(value)) {
            ret.push(value)
          }
        }
      }
    })


    return ret;
  } catch (err) {
    return []
  }

}

export const checkCodeInValid = (source:string) => {
    try {
      parse(source, { sourceType: 'module' })
      return 
    } catch (error) {
      console.log(error);
      return true
    }
}


export function emitFile(path:string, code:string) {
  fse.removeSync(path);
  fse.outputFileSync(path, code);
}

export  function getNodes (cells) {

  return cells.filter((c) => {
      let values = Object.values(NodeShape);
      return values.includes(c.shape);
  })
}