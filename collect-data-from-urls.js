const { Builder, By, Key, until } = require("selenium-webdriver");
const { appendFile, readFile } = require('fs/promises');

const urlsFileName = 'urls-mx.txt';
const jsonFileName = 'data-mx.json';

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
