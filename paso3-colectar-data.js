const { Builder } = require("selenium-webdriver");
const { appendFile, readFile } = require('fs/promises');
const config = require('./paso1.config.json');

const urlsFileName = `urls-${config.regionCode}.txt`;
const jsonFileName = `data-${config.regionCode}.json`;

async function main() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .build();

  const content = await readFile(urlsFileName, 'utf8');

  const urls = content
    .split(/\r?\n/)
    .map(url => url.trim())
    .filter(url => url.trim() !== '')
    .filter(Boolean);

  const arrayData = [];

  try {
    await driver.get(urls[0]);
    await driver.manage().addCookie({
      name: "EXP_RETAIL_NA",
      value: "200",
      path: "/",
      // domain: "example.com", // opcional si ya estás en el dominio
      // secure: true,
      // httpOnly: true,
      expiry: Math.floor(Date.now() / 1000) + 3600 * 5 // 5 horas
    });



    for (let url of urls) {
      await driver.get(url);
      
      const description = await driver.executeScript(
        "return document.querySelector('meta[name=\"description\"]')?.content || '';"
      );
      
      const canonicalUrl = await driver.executeScript(
        'return document.querySelector("link[rel=\\"canonical\\"]")?.href || "";'
      );
      const canonical = canonicalUrl || '';
      
      const rawPromotionalText = await driver.executeScript(
        'return document.querySelector(".promotional-content-container")?.innerText || "";'
      );

      const typePage = canonical.replace('https://', '').split('/')[2];
      const pageId = canonical.replace('https://', '').split('/')[3];

      let promotionalText = rawPromotionalText || "";
      promotionalText = promotionalText.charAt(0).toUpperCase() + promotionalText.slice(1);
      const promotionalTextArray = promotionalText.split("\n");
      promotionalTextArray[0] = `<h2>${promotionalTextArray[0]}</h2>`;
      promotionalText = promotionalTextArray.join("<br>").replace('</h2><br><br>', '</h2>');


      const object = {};
      if (['category', 'collection', 'brand', 'seller'].includes(typePage)) object.pageId = pageId;
      if (['shop'].includes(typePage)) object.searchTerm = pageId;
      object.title = await driver.getTitle() || "";
      object.description = description || '';
      object.canonical = canonical || '';
      object.promotionalText = promotionalText || '';
      object.delete = false;

      arrayData.push(object);
    }
    await appendFile(jsonFileName, JSON.stringify(arrayData, null, 2));

  } catch (error) {
    console.error("An error occurred:", error);
  }
  
  finally {
    await driver.quit();
  }
}

main();
