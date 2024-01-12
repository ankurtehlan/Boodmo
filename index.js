import puppeteer from "puppeteer";
import ExcelJS from "exceljs";
import myJson from "./data.json" assert { type: "json" };

(async () => {
  let data = [];

  for (let i = 0; i < myJson.length; i++) {
    let url = `https://boodmo.com/search/${myJson[i].name}`;
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    await page.goto(`${url}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".product-item-list__images");

    const handleSearch = await page.evaluate(() => {
      let quote = document
        .querySelector(".product-item-list__images")
        .getAttribute("href");
      return quote;
    });

    let nextPageUrl = handleSearch;
    let myObj = {};
    myObj.sku = myJson[i].name;

    const page2 = await browser.newPage();
    await page2.goto(`https://boodmo.com${nextPageUrl}`, {
      waitUntil: "domcontentloaded",
    });
    await page2.waitForSelector(".part-info-price__mrp");

    const handleSearchMrp = await page2.evaluate(() => {
      let Mrp = document.querySelector(".part-info-price__mrp").innerText;
      return Mrp;
    });

    myObj.price = handleSearchMrp;
    data.push(myObj);

    await browser.close();
  }

  // Create an Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Define the headers for your Excel sheet
  worksheet.columns = [
    { header: "SKU", key: "sku", width: 20 },
    { header: "Price", key: "price", width: 15 },
  ];

  // Add data to the worksheet
  data.forEach((row) => {
    worksheet.addRow(row);
  });

  // Save the workbook to a file
  await workbook.xlsx.writeFile("output.xlsx");

  console.log("Excel file created successfully.");
})();
