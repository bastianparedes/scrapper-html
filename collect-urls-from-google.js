const { Builder, By, Key, until } = require("selenium-webdriver");
const { appendFile } = require('fs/promises');

const fileName = 'urls-mx.txt';
const templateUrl = 'https://www.sodimac.com.mx/sodimac-mx/k/'

async function main() {
  let currentPageNumber = 1;
  let driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    await driver.get(`https://www.google.com/search?q=site:${templateUrl}`);

    while (true) {
        await driver.wait(
          until.elementsLocated(
            By.css(`a[href^="${templateUrl}"]`)
          ),
          15000
        );
    
        console.log('ayuda selector', `a[href^="${templateUrl}"]`);
        const elements = await driver.findElements(
          By.css(`a[href^="${templateUrl}"]`)
        );
    
        // ⬅️ array para guardar los links
        const links = [];
    
        for (const el of elements) {
          const href = await el.getAttribute("href");
    
          if (href) {
            links.push(href);
          }
        }
    
        for (let url of links) {
          await appendFile(fileName, url + '\n');
        }
    
        console.log("Links encontrados:");
        console.log(links);

        currentPageNumber += 1;;
        const elementNextPage = await driver.wait(until.elementLocated(By.css(`[aria-label^="Page ${currentPageNumber}"]`)), 15000);
        await elementNextPage.click();
    }


  } catch (error) {
    console.error("An error occurred:", error);
  }
  
  finally {
    // await driver.quit();
  }
}

main();
