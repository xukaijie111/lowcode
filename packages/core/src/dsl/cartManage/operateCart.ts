

import _ from 'lodash'

let cart = {
  list:[],
  total:0
}





export default async function(pipe,param){
    let {
      op,
      item
    } = param

  switch(op) {

    case "list":
      return _.cloneDeep(cart)
      break;

    case "add":
      
      let exit = _.find(cart.list,{ id: item.id});

      
      if (exit) {
        exit.number += item.number
        if (!(exit.number > 0)) {
          let index = _.findIndex(cart.list,{ id: item.id});
          cart.let.splice(index,1)
        }
      }else {
        cart.list.push(_.cloneDeep(item));
      }

      cart.total = cart.list.reduce((prev,now) => {
          now.number = Math.max(0,now.number);
          return now.number * now.price
      },0)

      return _.cloneDeep(cart)
      
      break;
  }
}