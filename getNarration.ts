// $('#snsBox .statistic_item[snsid] .content-box').toArray().map(v=>$(v).text()).map(v=>v.replaceAll(/\s/ig,' '));
import cheerio from "cheerio";
import fetch from "node-fetch";
import fs from "fs";
import {asyncList} from "./asyncList";
function createUrlPage(index:number){
    return `http://www.shuoshuodaitupian.com/new/index_${index}`;
}
const dataArr:string[]=[];
(async()=>{
    const taskList=new asyncList();
    for (let index = 1; index < 2000; index++) {
        taskList.addList(async()=>{
            const reqFetch=await fetch(createUrlPage(index)); 
            const pageData=(await reqFetch.buffer()).toString();
            const $=cheerio.load(pageData);        
            dataArr.push(...$('#snsBox .statistic_item[snsid] .content-box').toArray().map(v=>$(v).text()).map(v=>v.replace(/\s+/ig,' ')));
            console.log(index,dataArr.length);
        });
    }
    while(taskList.list.length){
        taskList.addList(...(await taskList.run(5)).errorList);
    }
    console.log('start write data to file ....');
    fs.writeFileSync(`${__dirname}/data/narration.json`,JSON.stringify(dataArr));
})().catch((info)=>{
    console.error(info);
    console.log('start write data to file ....');
    fs.writeFileSync(`${__dirname}/data/narration.json`,JSON.stringify(dataArr));
}).then(console.log);