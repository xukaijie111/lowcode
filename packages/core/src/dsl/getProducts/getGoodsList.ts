import dataflowDSL from "../dataflow";
import _ from 'lodash';
export default async function (pipe, param) {
  let {
    pageSize = 10,
    pageNum = 1
  } = param;
  let list = (await dataflowDSL.run('goodsList')) || [];
  console.log(`###list is `, list);
  let length = list.length;
  let ret = {
    total: length
  };
  let start = (pageNum - 1) * pageSize;
  let len = pageSize;
  ret.list = _.cloneDeep(list.slice(start, start + len));
  return ret;
}