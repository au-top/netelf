import {randomInt} from "./random";
export const proxies = [
    undefined,// use me 
    undefined,// use me 
    undefined,// use me 
    undefined,// use me 
];
export function randomGetProxy(){
    const u=proxies[randomInt(0,proxies.length)];
    console.log(
        u
    );
    return u;
}