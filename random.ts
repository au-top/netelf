export const symbolAgg = ",./;'";
export function toMaxMin(n1: number, n2: number) {
    return n1 > n2 ? { max: n1, min: n2 } : { max: n2, min: n1 };
}
// [min,max)
export function randomInt(min: number, max: number) {
    const nMaxMin = toMaxMin(min, max);
    min = nMaxMin.min;
    max = nMaxMin.max;
    return min + Math.floor(Math.random() * (max - min));
}
// [min,max]
export function randomIntContain(min: number, max: number) {
    return min == max ? min : randomInt(min, max + 1);
}
export function randomChar(isCase: boolean): string {
    const n = String.fromCharCode(randomInt(97, 122));
    return isCase ? n.toUpperCase() : n;
}
export function getSymbol() {
    return symbolAgg[randomInt(0, symbolAgg.length)];
}
export function getDateYears() {
    return randomInt(1970, new Date().getFullYear());
}
export function randomArray(_arr:Array<any>){
    const arr=[..._arr];
    const rCount=Math.round(arr.length/2);
    for(let i=0 ;i<rCount ;i++ ){
        const v1=arr[i];
        const rIndex=randomInt(rCount,arr.length);
        arr[i]=arr[rIndex];
        arr[rIndex]=v1;
    }
    return arr;
}