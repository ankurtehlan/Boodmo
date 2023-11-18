import puppeteer from "puppeteer";
import myJson from "./data.json" assert { type: "json" };

// Try to automate Start

(async () => {
  // const urls = ["3D INTERNATIONAL LLC", "247Lighting"];
  for (let i = 0; i < myJson.length; i++) {
    // const url = `https://automechanika.messefrankfurt.com/frankfurt/en/ausstellersuche.html?q=${urls[i]}`;
    let url = `https://automechanika.messefrankfurt.com/frankfurt/en/ausstellersuche.html?q=${myJson[i].name}`;
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.goto(`${url}`, { waitUntil: "domcontentloaded" });

    // Wait until class [ .a-link--no-focus ] is load
    await page.waitForSelector(".a-link--no-focus");

    // handling page data and print using query selector and click on href link
    const handleSearch = await page.evaluate(() => {
      // Fetch the element with class "// a-link--no-focus"
      let quote = document.querySelector(".a-link--no-focus").click();
      return { quote };
    });

    // run the handleSearch Function
    console.log(handleSearch);

    // After redirect to second Page query selector code start here

    // Wait until class [ .ex-contact-box__contact-btn ] is load
    await page.waitForSelector(".ex-contact-box__contact-btn");

    // Print page data using query selector

    const getCustomerData = await page.evaluate(() => {
      // Fetch the element with class and print "// .ex-contact-box__contact-btn"
      let mail = document
        .querySelector(".ex-contact-box__contact-btn")
        .getAttribute("href");
      return { mail };
    });

    console.log(getCustomerData);
    // After redirect to second Page query selector code end here

    await browser.close();
  }
})();

// Try to automate End

// const getQuotes = async () => {
//   // Start a Puppeteer session with:
//   // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
//   // - no default viewport (`defaultViewport: null` - website page will in full width and height)
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//   });

//   // Open a new page
//   const page = await browser.newPage();

//   // On this new page:
//   // - wait until the dom content is loaded (HTML is ready)
//   let url =
//     "https://automechanika-dubai.ae.messefrankfurt.com/dubai/en/exhibitor-search.html?q=Meko%20Auto%20Components%20Inc.";

//   await page.goto(url, {
//     waitUntil: "domcontentloaded",
//   });

//   // Wait until class [ .a-link--no-focus ] is load
//   await page.waitForSelector(".a-link--no-focus");

//   // handling page data and print using query selector and click on href link
//   const handleSearch = await page.evaluate(() => {
//     // Fetch the element with class "// a-link--no-focus"
//     let quote = document.querySelector(".a-link--no-focus").click();
//     return { quote };
//   });

//   // run the handleSearch Function
//   console.log(handleSearch);

//   // After redirect to second Page query selector code start here

//   // Wait until class [ .ex-contact-box__contact-btn ] is load
//   await page.waitForSelector(".ex-contact-box__contact-btn");

//   // Print page data using query selector

//   const getCustomerData = await page.evaluate(() => {
//     // Fetch the element with class and print "// .ex-contact-box__contact-btn"
//     let mail = document
//       .querySelector(".ex-contact-box__contact-btn")
//       .getAttribute("href");
//     return { mail };
//   });

//   console.log(getCustomerData);
//   // After redirect to second Page query selector code end here

//   // Close the browser
//   await browser.close();
// };

// // Start the scraping
// getQuotes();
