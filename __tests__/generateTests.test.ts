import sendFinalElementEvents from '../src/app/modules/generateTests';

describe('Basic test generation', () => {
  it('should generate basic test setup with no inputs', () => {
    const basicTest = 
`const puppeteer = require('puppeteer');
describe('This is a unit test', () => {
  it('passes this test', async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://localhost:8080');
    await browser.close();
  });
});`;
    expect(sendFinalElementEvents([])).toEqual(basicTest);
  });
});