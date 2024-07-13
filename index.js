import puppeteer from "puppeteer";
import ExcelJS from "exceljs";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const maxRetries = 3;
const delayBetweenRetries = 3000; // 3 seconds

(async () => {
  let data = [];

  // Load the Excel file
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("input.xlsx");
  const worksheet = workbook.getWorksheet(1); // Assuming the SKUs are in the first sheet

  // Extract SKUs from the Excel file
  let skus = [];
  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1) {
      // Skip the header row
      skus.push(row.getCell(1).value); // Assuming SKUs are in the first column
    }
  });

  // Launch the browser once and reuse it
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  for (let i = 0; i < skus.length; i++) {
    let url = `https://boodmo.com/search/${skus[i]}`;
    const page = await browser.newPage();

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });

        // Simulate human-like delay
        await delay(randomDelay(1000, 3000));

        await page.waitForSelector(".product-item-list__images");

        // Simulate mouse movement
        const target = await page.$(".product-item-list__images");
        const box = await target.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await delay(randomDelay(500, 1500)); // Random delay before clicking

        const handleSearch = await page.evaluate(() => {
          let quote = document
            .querySelector(".product-item-list__images")
            .getAttribute("href");
          return quote;
        });

        let nextPageUrl = handleSearch;
        let myObj = {};
        myObj.sku = skus[i];

        const page2 = await browser.newPage();
        await page2.goto(`https://boodmo.com${nextPageUrl}`, {
          waitUntil: "domcontentloaded",
        });

        // Simulate human-like delay
        await delay(randomDelay(1000, 3000));

        await page2.waitForSelector(".part-info-price__mrp");

        // Simulate mouse movement
        const targetMrp = await page2.$(".part-info-price__mrp");
        const boxMrp = await targetMrp.boundingBox();
        await page2.mouse.move(
          boxMrp.x + boxMrp.width / 2,
          boxMrp.y + boxMrp.height / 2
        );
        await delay(randomDelay(500, 1500)); // Random delay before extracting text

        const handleSearchMrp = await page2.evaluate(() => {
          let Mrp = document.querySelector(".part-info-price__mrp").innerText;
          return Mrp;
        });

        myObj.price = handleSearchMrp;
        data.push(myObj);

        // Close the pages properly
        await page2.close();
        break; // Exit retry loop on success
      } catch (error) {
        console.error(
          `Error processing SKU ${skus[i]} on attempt ${attempt + 1}:`,
          error
        );
        if (attempt < maxRetries - 1) {
          console.log(
            `Retrying SKU ${skus[i]} in ${
              delayBetweenRetries / 1000
            } seconds...`
          );
          await delay(delayBetweenRetries);
        } else {
          console.log(
            `Failed to process SKU ${skus[i]} after ${maxRetries} attempts.`
          );
        }
      }
    }

    await page.close();

    // Simulate human-like delay between each SKU processing
    await delay(randomDelay(2000, 5000));
  }

  await browser.close();

  // Create an Excel workbook and worksheet
  const outputWorkbook = new ExcelJS.Workbook();
  const outputWorksheet = outputWorkbook.addWorksheet("Data");

  // Define the headers for your Excel sheet
  outputWorksheet.columns = [
    { header: "SKU", key: "sku", width: 20 },
    { header: "Price", key: "price", width: 15 },
  ];

  // Add data to the worksheet
  data.forEach((row) => {
    outputWorksheet.addRow(row);
  });

  // Save the workbook to a file
  await outputWorkbook.xlsx.writeFile("output.xlsx");

  console.log("Excel file created successfully.");
})();
