const fs = require('fs');
const { parse } = require('csv-parse/sync');
const config = require('./paso1.config.json');

const main = async () => {
    const fileContent = fs.readFileSync(`./output-${config.regionCode}.csv`, 'utf8');
    const records = parse(fileContent, {
    columns: true,      // usa la primera fila como headers
    skip_empty_lines: true
    });

    for (let record of records) {
        const myHeaders = new Headers();
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "es-419,es;q=0.9,en;q=0.8");
        myHeaders.append("authorization", "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5USTVOREE1TWpNMk1ETTNOVFkwUWtFek16ZzRSREJHT1RRNFFVVkJNRVl5UkVSQk9VWkJNdyJ9.eyJodHRwczovL29zbW9zLnNlcnZpY2VzIjp7InRlbmFudF9pZCI6ImJiNzFmNGRiLTdmYWItNGZmNC04OTgzLWQzZTM3NTMwNTFlNCJ9LCJpc3MiOiJodHRwczovL29zbW9zLmF1dGgwLmNvbS8iLCJzdWIiOiJVWWdTMnpzRlVkckhMMUJZVjhTeTVqWlBtT2lFTEx3MEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9zb2RpbWFjLnNlcnZpY2VzIiwiaWF0IjoxNzY5ODE3NjE3LCJleHAiOjE3NzI0MDk2MTYsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IlVZZ1MyenNGVWRySEwxQllWOFN5NWpaUG1PaUVMTHcwIiwicGVybWlzc2lvbnMiOltdfQ.eIVtB2toJc73ldcQ2-9cfnN9mVqOPleUre75QVSpQ7BigAV4QWnMSgny96xC2mzAB6ZogVFohbVQuBjpqMo7ufaP9iuw86baK-T9b9OlqvEQPxVceSvIxvodSmD_u6kcOPOCVq2OEBDeXyMe1_0xhK7g63Fniq_Jccds4u7crxLfNgeDl0x2r4Hin7rklOec_3rx0zKWF5c3bJQdiouDwTGCP1QznArr8eGpSSA7_EO85HPAkXDfOd3xvq9fRHmYjfPvAy0MPlLO8sSWB8w9gglvrro_S1Ai242dSKD--elOe_eMbAF6cP3RlQ1SnoKbmVTgs6gdeMxRo5ZgmLA84w");
        myHeaders.append("cache-control", "no-cache");
        myHeaders.append("content-type", "application/json");
        myHeaders.append("origin", "https://falabella-catalyst-bu-prod.web.app");
        myHeaders.append("pragma", "no-cache");
        myHeaders.append("priority", "u=1, i");
        myHeaders.append("referer", "https://falabella-catalyst-bu-prod.web.app/");
        myHeaders.append("sec-ch-ua", "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("sec-ch-ua-platform", "\"macOS\"");
        myHeaders.append("sec-fetch-dest", "empty");
        myHeaders.append("sec-fetch-mode", "cors");
        myHeaders.append("sec-fetch-site", "cross-site");
        myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36");
        
        const raw = JSON.stringify({
          "audit": {
            "updatedBy": "bparedesp@falabella.cl"
          },
          "store": "so_retail",
          "metaData": {
            "so_retail": {
              "title": record.title,
              "description": record.description,
              "canonical": record.canonical
            }
          },
          "rules": [
            {
              "filterKey": "{}",
              "userData": {
                "leftPromotionalContent": record.promotionalText
              }
            }
          ],
          "Ntt": record.searchTerm,
          "shopId": record.searchTerm,
          "originalTerm": record.searchTerm
        });
        
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        
        await fetch(`https://catalyst-prod-origin.falabella.com/s/configuration/v2/pages/shop/${record.searchTerm}?country=${config.regionCode}&page=1&query=`, requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
    }
}
main();
