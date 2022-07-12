import dataflowDSL from "../dataflow";
export default async function (pipe) {
  let a = 8;
  dataflowDSL.run('age', a);
}