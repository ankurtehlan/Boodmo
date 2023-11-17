import puppeteer from "puppeteer";
var customer_url;


const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("https://automechanika-dubai.ae.messefrankfurt.com/dubai/en/exhibitor-search.html?q=Meko%20Auto%20Components%20Inc.", {
    waitUntil: "domcontentloaded",
  });

    // Sample Code Start here
  //     await page.goto("https://boodmo.com/search/2630002752/", {
  //   waitUntil: "domcontentloaded",
  // });
    // Sample Code end here

    await page.waitForSelector('.a-link--no-focus');

    const quotes = await page.evaluate(() => {
        // Fetch the first element with class "quote"
        let quote = document.querySelector(".a-link--no-focus").getAttribute("href")
        // const val = b.querySelector("a").href
        // const d = quote.querySelector("a").href

        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        // const text = quote.querySelector(".text").innerText;
        // const author = quote.querySelector(".author").innerText;
    
        return { quote };
      });


  // Query for an element handle.


//   // Get page data
  // const quotes = await page.evaluate(() => {
  //   // Fetch the first element with class "quote"
  //   const quote  = document.querySelector("").href;

  //   // Fetch the sub-elements from the previously fetched quote element
  //   // Get the displayed text and return it (`.innerText`)
  //   // const text = quote.querySelector(".text").innerText;
  //   // const author = quote.querySelector(".author").innerText;

  //   return { quote };
  // });

  // Display the quotes
  console.log(quotes);



// // second data code start here
//   const page2 = await browser.newPage();

//   await page.goto("quote", {
//     waitUntil: "domcontentloaded",
//   });

//   const companyInfo = await page.evaluate(() => {
//     // Fetch the first element with class "quote"
//     const mobile = document.getElementsByTagName("a").title;
//     customer_url = quote
//     // Fetch the sub-elements from the previously fetched quote element
//     // Get the displayed text and return it (`.innerText`)
//     // const text = quote.querySelector(".text").innerText;
//     // const author = quote.querySelector(".author").innerText;

//     return { companyIF };
//   });

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();


// url = https://automechanika-dubai.ae.messefrankfurt.com/dubai/en/exhibitor-search.html?q=Guangdong+Faret+Auto+Radiator+Co.+Ltd.
// a-link--no-focus
// classname = ex-contact-box__address-field-tel-number