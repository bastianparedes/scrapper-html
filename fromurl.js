const { DOMParser } = require("xmldom");

const main = async () => {
    const sitemapUrl = "https://www.sodimac.com.mx/sodimac-catalyst-bu-prod-browse-sitemaps/somx-browse-keyword-sitemap.xml";
    
    const res = await fetch(sitemapUrl);
    const xmlText = await res.text();
    
    const doc = new DOMParser().parseFromString(xmlText, "application/xml");
    const locNodes = doc.getElementsByTagName("loc");
    
    const urls = Array.from(locNodes).map(n => n.textContent);
    
    console.log(urls);
};
main();