

let goodsLists = [
  {
    name:"衬衫",
    price:1000,
    description:"好看又实用的衬衫哦",
    image:"1.png",
    id:1
  },
  {
    name:"皮夹",
    price:2000,
    description:"好看又实用的皮夹哦",
     image:"2.png",
    id:2
  },
  {
    name:"外套",
    price:3000,
    description:"男人的专属外套",
     image:"3.png",
    id:3
  },
  {
    name:"袜子",
    price:1000,
    description:"又便宜又好看的袜子",
     image:"4.png",
    id:4
  },
  {
    name:"内裤",
    price:1000,
    description:"想要奥特曼内裤么",
     image:"5.png",
    id:5
  },
  {
    name:"T shirt",
    price:1200,
    description:"明星同款",
    id:6,
     image:"6.png",
  },
  {
    name:"耐克鞋子",
    price:8800,
    description:"绝对不是假货",
    id:7,
     image:"7.png",
  },
  {
    name:"牛仔裤",
    price:100,
    description:"西部牛仔的专属",
    id:8,
     image:"8.png",
  },
  {
    name:"漂亮",
    price:1000,
    description:"好看又实用的衬衫哦",
    id:9,
     image:"9.png",
  },
  {
    name:"皮夹",
    price:2000,
    description:"好看又实用的皮夹哦",
    id:10,
     image:"10.png",
  },
  {
    name:"外套",
    price:3000,
    description:"男人的专属外套",
    id:11,
     image:"11.png",
  },
  {
    name:"袜子",
    price:1000,
    description:"又便宜又好看的袜子",
    id:12,
     image:"12.png",
  },
  {
    name:"内裤",
    price:1000,
    description:"想要奥特曼内裤么",
    id:13,
     image:"13.png",
  },
  {
    name:"T shirt",
    price:1200,
    description:"明星同款",
    id:14,
     image:"14.png",
  },
  {
    name:"耐克鞋子",
    price:8800,
    description:"绝对不是假货",
    id:15,
     image:"15.png",
  },
  {
    name:"牛仔裤",
    price:100,
    description:"西部牛仔的专属",
    id:16,
     image:"16.png",
  }
]

let data = {
    goodsList:goodsLists
}

export default async function(pipe,key,value){
    if (value === undefined)  return data[key]
  else  data[key] = value

}