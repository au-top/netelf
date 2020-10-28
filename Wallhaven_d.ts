export declare interface imgInfo{
    imgSrc:string,
    fromPageSrc:string,
    info:{
        purity?:string,
        uploader?:string,
        tag?:Array<string>
    },
    download?:boolean
}