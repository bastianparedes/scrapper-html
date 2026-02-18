const { Builder, By, Key, until } = require("selenium-webdriver");
const { appendFile } = require('fs/promises');
const config = require('./config.json');

const fileName = `urls-${config.regionCode}-1.txt`;
const templateUrl = `https://www.sodimac.com.${config.regionCode}/sodimac-${config.regionCode}/k/`

async function main() {
  let currentPageNumber = 1;
  let driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    await driver.get(`https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fwww.sodimac.com.mx%2Fsodimac-mx%2Fk%2F&sca_esv=babc3dbce6714cb9&biw=1200&bih=796&ei=QviVacWXA7eG5OUPgZ6suAc&ved=0ahUKEwjFwPfayeOSAxU3A7kGHQEPC3c4rAIQ4dUDCBE&uact=5&oq=site%3Ahttps%3A%2F%2Fwww.sodimac.com.mx%2Fsodimac-mx%2Fk%2F&gs_lp=Egxnd3Mtd2l6LXNlcnAiLXNpdGU6aHR0cHM6Ly93d3cuc29kaW1hYy5jb20ubXgvc29kaW1hYy1teC9rL0j2AlAAWABwAXgAkAEAmAEAoAEAqgEAuAEDyAEAmAIAoAIAmAMAiAYBkgcAoAcAsgcAuAcAwgcAyAcAgAgA&sclient=gws-wiz-serp`);

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
