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
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("https://automechanika-dubai.ae.messefrankfurt.com/dubai/en/exhibitor-search.html?q=Meko%20Auto%20Components%20Inc.", {
    waitUntil: "domcontentloaded",
  });

    await page.waitForSelector('.a-link--no-focus');

    const quotes = await page.evaluate(() => {
        // Fetch the element with class "// a-link--no-focus"
        let quote = document.querySelector(".a-link--no-focus").getAttribute("href")
        customer_url = quote
        return { quote };
      });

  // Display the quotes
  console.log(quotes);

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();



