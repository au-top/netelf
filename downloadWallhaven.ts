import _nodeFetch from "node-fetch";
import fs from "fs"
import md5 from "md5-node";
import {randomGetProxy} from "./proxy"
import {imgInfo} from './Wallhaven_d';
import {asyncList} from "./asyncList";
async function nodeFetch(src:string){
    return _nodeFetch(src);
}

(async()=>{
    const imgDirPath=`${__dirname}/img`;
    const downloadListFileList=fs.readdirSync(imgDirPath);
    const asyncListElem=new asyncList()
    for(const downloadListFile of downloadListFileList){
        const loadPath=`${imgDirPath}/${downloadListFile}`;
        console.log(loadPath);
        const fData:Array<imgInfo>=JSON.parse( fs.readFileSync(loadPath).toString() );

        setInterval(()=>{
            fs.writeFileSync(loadPath,JSON.stringify(fData));
            console.log('re config');
        },1000*40);

        const downloadFile=fData.filter(v=>!v.download);
        const taskList=downloadFile.map((v)=>async ()=>{
            const imgData=(await (await nodeFetch(v.imgSrc)).buffer());
            const fileName=v.imgSrc.split('/').pop();
            const fileSavePath=`${imgDirPath}/${fileName}`;
            console.log(`Download ~ ${fileName} size ${imgData.byteLength/1024}kb to ${fileSavePath}`);
            fs.writeFileSync(`${fileSavePath}`,imgData);
            console.log(`writeFile ~ ${fileName} size ${imgData.byteLength/1024}kb `);
            v.download=true;
        });
        asyncListElem.addList(...taskList);
        while(asyncListElem.list.length){
            await asyncListElem.run(1);
        }
    }
})();