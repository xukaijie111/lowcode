
import _ from 'lodash';

export default async function(pipe,age) {
  console.log(age);
  console.log(`###pipe get is `,pipe.getData('name'))
  return "xukaijie ni hao"
}