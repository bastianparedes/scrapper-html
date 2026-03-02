const { DOMParser } = require("xmldom");
const { appendFile } = require('fs/promises');
const config = require('./paso1.config.json');

const main = async () => {
    const sitemapUrl = config.sitemapUrl;
    
    const res = await fetch(sitemapUrl);
    const xmlText = await res.text();
    
    const doc = new DOMParser().parseFromString(xmlText, "application/xml");
    const locNodes = doc.getElementsByTagName("loc");
    
    const urls = Array.from(locNodes).map(n => n.textContent);
    for (let url of urls) {
        await appendFile(`urls-${config.regionCode}.txt`, url + '\n');
    }
    
    console.log(urls);
};
main();
