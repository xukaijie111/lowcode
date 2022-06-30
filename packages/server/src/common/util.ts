

import { parse } from "@babel/parser"
import traverse from "@babel/traverse"


export function generateId(len = 10) {
  let s = ""
  while (len--) {
    s += Math.round(Math.random() * 10);
  }
  return s
}



export function parseDependency(source:string) {

  function isNpmPackage(value:string) {

    return /^[a-z]/.test(value)
  }


  try {
    let ret = [];
    const ast = parse(source, { sourceType: 'module' })


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

    console.log(`####ret is `, ret);

    return ret;
  } catch (err) {
    console.log(err)
    return []
  }

}

export const checkCodeInValid = (source:string) => {

    try {
      parse(source, { sourceType: 'module' })
      return 
    } catch (error) {
      return `代码错误，可至 https://astexplorer.net/ 转换查看`
    }
}