import puppeteer from "puppeteer";
import myJson from "./data.json" assert { type: "json" };
// Try to automate Start

(async () => {
  
  let data = [];
    for (let i = 0; i < myJson.length; i++) {
      // const url = `https://automechanika.messefrankfurt.com/frankfurt/en/ausstellersuche.html?q=${urls[i]}`;
      let url = `https://boodmo.com/search/${myJson[i].name}`;
      const browser = await puppeteer.launch({
        headless: false,
        // headless: 'new',
        defaultViewport: null,
      });
      const page = await browser.newPage();

      await page.goto(`${url}`, { waitUntil: "domcontentloaded" });

      // Wait until class [ .a-link--no-focus ] is load
      await page.waitForSelector(".product-item-list__images");

      // handling page data and print using query selector and click on href link
      const handleSearch = await page.evaluate(() => {
        // Fetch the element with class "// a-link--no-focus"
        let quote = document.querySelector(".product-item-list__images").getAttribute("href");
        // fetching Second Data Code Start here

        return quote ;
      });
      // run the handleSearch Function
      // console.log(handleSearch);
      let skuSearch = handleSearch;
      let skuData = {
        "sku":skuSearch,
      }
      data.push(skuData)
      // console.log(data.sku);
      
      // second Page Data fetching code start here

      // const page2 = await browser.newPage();
      // for (let i = 0; i < data.length; i++) {
        
      //   await page2.goto(`https://boodmo.com${data[i].sku}`, { waitUntil: "domcontentloaded" });

      //   // wait for selector
      //   await page2.waitForSelector(".part-info-price__mrp");
      //   const handleSearchMrp = await page2.evaluate(() => {
      //     // Fetch the element with class "// part-info-price__mrp
      //     let Mrp = document.querySelector(".part-info-price__mrp").innerText
      //     return Mrp ;
      //   });
      //   let mrpSearch = handleSearchMrp;
      //   let mrpData = {
      //     "mrp":mrpSearch,
      //   }
      //   data.push(mrpData)
      // }
        
        await browser.close();
        for (let i = 0; i < data.length; i++) {
          console.log(data[i].sku);
        }
    }

  }
)();




// Try to automate End

