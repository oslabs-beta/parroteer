import { CSSSelector, ElementState, MutationEvent, RecordingState, UserInputEvent } from '../../types/Events';

type Events = (UserInputEvent | MutationEvent)[]

const importPuppeteer = 'const puppeteer = require(\'puppeteer\');\n';
const header = `describe('This is a unit test', () => {
  it('passes this test', async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:8080');\n`;

const footer = `await browser.close();});});`;

const jestOutline = (event: MutationEvent) => {
  const change = event.value || event.textContent || event.class;
  return `\t\tawait expect(${'hi'}).to.be(${'value'});\n`;
};

const puppeteerEventOutline = (eventType: string, selector: string ) => {
  return `\t\tawait page.click(${selector});\n`;
};

export default function sendFinalElementEvents(events: Events) {
  let outputStr = importPuppeteer + header;
  for (const event of events) {
    const {type} = event;
    // logic for events using puppeteer to simulate user clicks
    if (type === 'input') {
      outputStr += puppeteerEventOutline('click', 'event selector');
    } else if (type === 'mutation') {
      outputStr += jestOutline(event);
    }
    // logic for mutations observed in dom diffing after user events




    // TODO: send message to UI with testing script
  }
  return outputStr + footer;
}

// 
