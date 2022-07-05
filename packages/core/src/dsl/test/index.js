
import Pipe from '../../pipe'

import Start from './start';

import Console from './console';

import Meta from './meta.json';

let list = [
    Start,
    Console
]


let pipe = new Pipe(Meta,list)

export default pipe;
