import * as cheerio from "cheerio";
import {asyncList} from "./asyncList";
import _nodeFetch from "node-fetch";
import fs from "fs"
import md5 from "md5-node";
import HttpsProxyAgent from "https-proxy-agent";
import {randomGetProxy} from "./proxy"
import {imgInfo} from './Wallhaven_d';


const nodeFetch=(url:string,conf?)=>{
    const proxy=randomGetProxy();
    return _nodeFetch(
        url,
        Object.assign(conf??{},{
            timeout: 1000*15,
            agent: proxy===undefined?proxy:HttpsProxyAgent(proxy) 
        })
    )
}

const savePath=`${__dirname}/img/`;

const get2CYMin1080P=
    (index:string)=>
    `https://wallhaven.cc/search?categories=010&purity=110&topRange=1M&sorting=toplist&order=desc&page=${index}`;

async function getMainIndex(pageUrlF:(...s:Array<string>)=>string,index:number){
    const reqStr=pageUrlF(index.toString());
    const res=await nodeFetch(reqStr);
    const $pageHtml=cheerio.load((await res.buffer()).toString());
    const aList=$pageHtml('#main #thumbs .thumb-listing-page .thumb a.preview');
    const imageSrcList=[...new Set(aList.toArray().map(v=>v.attribs.href).filter(v=>v).map(v=>v.trim()))];
    const downloadImgInfoList=new asyncList();
    const imgInfoResList:Array<imgInfo>=[];
    imageSrcList.forEach(v=>{
        downloadImgInfoList.addList(
            async ()=>imgInfoResList.push(await fromPageGetImgUrl(v))
        )
    });
    console.log(` task Length : ${downloadImgInfoList.list.length} `);
    while(downloadImgInfoList.list.length){
        const r=await downloadImgInfoList.run(8);
        console.log(
            `
                Success Length ${r.successList.length} ,
                Error Length ${r.errorList.length} ,
            `
        );
    }
    return imgInfoResList;
}


async function fromPageGetImgUrl(url:string): Promise<imgInfo>{
    const pageHtml=await (await nodeFetch(url)).buffer();
    const $pageHtml=cheerio.load( pageHtml );
    const imgList=$pageHtml('#wallpaper');
    if(imgList.length==0){
        throw {msg:'fromPageDownload no file ',info:{url:url,html:pageHtml}};
    }
    const imgSrc=imgList[0].attribs.src;
    const $info=$pageHtml("[data-storage-id=\"showcase-info\"]");
    const resUploaderName=(()=>{
        let userNameList=$info.find('.username');
        return userNameList.length?userNameList.text():undefined;
    })();
    const resPurity=(()=>{
        const res=$info.find('.purity').text();
        return res.length==0?undefined:res;
    })();
    const tagList=$pageHtml('#tags .tagname').toArray().map(v=>$pageHtml(v).text());
    return {
        imgSrc:imgSrc,
        fromPageSrc:url,
        info:{
            purity:resPurity,
            uploader:resUploaderName,
            tag:tagList
        }
    }
}

function getMaxPage(root:cheerio.Root){
    try{
        const l=root('.thumb-listing-page-header')
        if(l.length){
            return parseInt(root(l.toArray()[0]).text().split('/')[1].trim()) 
        }
        return null;
    }catch(e){
        console.log('getMaxPage error info : ',e);
        return null;
    }
}

(async()=>{
    await (async (
        urlGetF:(s:string)=>string,
    )=>{
        //get page index max
        const indexMax=getMaxPage(cheerio.load((await (await nodeFetch(urlGetF('2'))).buffer()).toString()))??1;
        console.log(`max page ${indexMax}`);
        const mainList=[];
        for(let index=1;index<=indexMax;index++){
            console.log(`download page index ${index}`);
            let getNewList;
            while(1){
                try{
                    getNewList= await getMainIndex(urlGetF,index);
                    break;
                }catch(e){
                    console.log(e);
                }
            }
            mainList.push(...getNewList);
            const fileName=`${savePath}${md5(urlGetF('x'))}.json`;
            console.log(
                `
                writeFileSync JSON To ${fileName} 
                CountImgLength : ${mainList.length} ,
                NewImg : ${getNewList.length} 
                `
            );
            fs.writeFileSync(fileName,JSON.stringify(mainList));
        }
        console.log('download over');
    })(get2CYMin1080P);
})();
