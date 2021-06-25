import puppeteer from 'puppeteer';

const url = process.argv[2];

(async () => {
  try {
    const browser = await puppeteer.launch({
      defaultViewport: {
        width: 600,
        height: 700,
      },
      headless: true,
      // devtools: true
    });
    const page = await browser.newPage();
    const mouse_click = async (x, y, time) => {
      await Promise.all([
        page.mouse.move(x, y),
        page.waitForTimeout(time),
        page.mouse.click(x, y)
      ]);
    };
      
    await page.goto(url, { waitUntil: "networkidle2" });
      
    await mouse_click(260, 366, 1000);
    await page.waitForTimeout(2000);
    await mouse_click(167, 273, 1000);

    console.log("3三らいおん 1二らいおん");
      
    await page.waitForTimeout(2000);

    await mouse_click(260, 280, 1000);
    await page.waitForTimeout(2000);
    await mouse_click(255, 180, 1000);

    console.log("2二ひよこ 2一きりん");

    await page.waitForTimeout(2000);

    await mouse_click(163, 367, 1000);
    await page.waitForTimeout(2000);
    await mouse_click(260, 280, 1000);

    console.log("2三ぞう");

    page.on('dialog', async (dialog) => {
      console.log(await dialog.message());
      await dialog.dismiss();
    });
      
    await page.waitForTimeout(1000);
    await browser.close();
      
  } catch (e) {
    console.log(e);
  }
    
})();