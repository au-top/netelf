import {randomInt} from "./random";
export const proxies = [
    undefined,// use me 
    undefined,// use me 
    undefined,// use me 
    undefined,// use me 
    'http://Dai11:Aa123456@81.68.218.191:808',
    'http://Dai12:Aa123456@81.68.218.231:808',
    'http://Dai13:Aa123456@81.68.230.108:808',
    'http://Dai14:Aa123456@81.68.155.237:808',
    'http://Dai15:Aa123456@81.68.230.102:808',
    'http://Dai16:Aa123456@81.68.224.82:808' ,
    'http://Dai17:Aa123456@81.68.184.156:808',
    'http://Dai18:Aa123456@81.68.225.185:808',
    'http://Dai19:Aa123456@81.68.216.163:808',
    'http://Dai20:Aa123456@81.68.225.176:808',
    'http://Dai3:Aa123456@81.68.215.212:808' ,
    'http://Dai4:Aa123456@81.68.218.231:808' 
];
export function randomGetProxy(){
    const u=proxies[randomInt(0,proxies.length)];
    console.log(
        u
    );
    return u;
}