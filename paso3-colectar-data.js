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
      const title = await driver.getTitle() || "";

      const description = await driver.executeScript(
        "return document.querySelector('meta[name=\"description\"]')?.content || '';"
      );
      
      const canonicalUrl = await driver.executeScript(
        'return document.querySelector("link[rel=\\"canonical\\"]")?.href || "";'
      );

      const promotionalText = await driver.executeScript(
        'return document.querySelector(".promotional-content-container")?.innerText || "";'
      );

      arrayData.push({
        title,
        description,
        canonicalUrl,
        promotionalText
      });
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
