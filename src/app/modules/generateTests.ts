
import {PickedElementEvent, MutationEvent, UserInputEvent } from '../../types/Events';

type Events = (UserInputEvent | MutationEvent | PickedElementEvent)[]


const importPuppeteer = 'const puppeteer = require(\'puppeteer\');\n';
const header = `describe('This is a unit test', () => {
  it('passes this test', async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:8080');\n`;
    // TODO: capture url in background

const footer = '\n\t\tawait browser.close();\n\t\t});\n\t}\n);';

const jestOutline = (event: MutationEvent) => {
  let change;
  
  let expectations = '';
  for (const key in event) {
    if (key === 'textContent') change = 'textContent';
    else if (key === 'value') change = 'value';
    else if(key === 'class') change = 'classList.value';
    else continue;
    expectations += `\t\texpect(el.${change}).toEqual(${event[key]})\n`;
  }
  return `\t\tawait page.waitFor('[data-parroteer-id="${event.parroteerId}"]').then(el => {\n${expectations}})`;
  // return waitFor + `\t\tawait expect(${event.parroteerId}).${change});\n`;
};

const puppeteerEventOutline = (event: UserInputEvent) => {
  let eventType;
  if (event.eventType === 'click') eventType = 'click';
  else eventType = 'keyboard.press';
  // TODO: access parroteer id properly
  return `\t\tawait page.${eventType}('[data-parroteer-id="${event.parroteerId}"]');\n`;
};

const pickEvent = (event: PickedElementEvent) => {
  return `\t\tawait page.waitFor("${event.initialSelector}").then(el => el.dataset.parroteerId = "${event.parroteerId}")\n`;
};

export default function sendFinalElementEvents(events: Events) {
  let outputStr = importPuppeteer + header;
  for (const event of events) {
    const {type} = event;
    // logic for events using puppeteer to simulate user clicks
    switch (type) {
      case 'input':
        outputStr += puppeteerEventOutline(event as UserInputEvent);
        break;
      case 'mutation':
        outputStr += jestOutline(event as MutationEvent);
        break;
      case 'picked-element':
        outputStr += pickEvent(event as PickedElementEvent);
        break;
      default:
        console.log(`how did ${type} get in here???`);
        break;
    }
  }
  return outputStr + footer;
}
  
/* 
		await page.waitFor("#chapters").then(el => el.dataset.parroteerId = "503203bc-d26b-4c6a-95a9-529938487b3d")		await page.waitFor("#per_chapter").then(el => el.dataset.parroteerId = "7447de0a-d127-48a9-917c-13d03f4154d2")		await page.waitFor("div > .CodeMirror-line > span > .cm-comment").then(el => el.dataset.parroteerId = "0330c8c5-7907-4690-90de-ff544e656ee7")await browser.close();});});


const puppeteer = require('puppeteer');
describe('This is a unit test', () => {
  it('passes this test', async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:8080');
		await page.waitFor("#chapters").then(el => el.dataset.parroteerId = "503203bc-d26b-4c6a-95a9-529938487b3d")		await page.waitFor("#per_chapter").then(el => el.dataset.parroteerId = "7447de0a-d127-48a9-917c-13d03f4154d2")		await page.waitFor("div > .CodeMirror-line > span > .cm-comment").then(el => el.dataset.parroteerId = "0330c8c5-7907-4690-90de-ff544e656ee7")await browser.close();});});
*/

/* 

const puppeteer = require('puppeteer');
describe('This is a unit test', () => {
  it('passes this test', async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:8080');
		await page.waitFor("#chapters").then(el => el.dataset.parroteerId = "98a22839-1f82-4f03-b4b5-500c04c1db94")
		await page.waitFor("#per_chapter").then(el => el.dataset.parroteerId = "f3917b38-bfd3-473a-a1f2-b59448682d2b")
		await page.waitFor("div > .CodeMirror-line > span > .cm-comment").then(el => el.dataset.parroteerId = "ddfaf3c6-526f-481a-9876-5bcd60e7503a")

		await browser.close();
		});
	}
);
*/

/* 
Parroteer
Setup
Recording
Tests
Pick Elements
const puppeteer = require('puppeteer');
describe('This is a unit test', () => {
  it('passes this test', async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:8080');
		await page.waitFor("#chapters").then(el => el.dataset.parroteerId = "98a22839-1f82-4f03-b4b5-500c04c1db94")
		await page.waitFor("#per_chapter").then(el => el.dataset.parroteerId = "f3917b38-bfd3-473a-a1f2-b59448682d2b")
		await page.waitFor("div > .CodeMirror-line > span > .cm-comment").then(el => el.dataset.parroteerId = "ddfaf3c6-526f-481a-9876-5bcd60e7503a")
		await page.waitFor("#cover > p").then(el => el.dataset.parroteerId = "42c2c973-5ebf-4da3-a609-a9e591da4743")
		await page.waitFor("#cover > h1").then(el => el.dataset.parroteerId = "1c8a9374-cd23-4a39-86c9-bd268eed9a14")
		await page.click('[data-parroteer-id="undefined"]');
		await page.waitFor('[data-parroteer-id="42c2c973-5ebf-4da3-a609-a9e591da4743"]').then(el => {
		expect(el.classList.value).toEqual(test)
})		await page.waitFor('[data-parroteer-id="1c8a9374-cd23-4a39-86c9-bd268eed9a14"]').then(el => {
		expect(el.textContent).toEqual(hi)
})		await page.click('[data-parroteer-id="undefined"]');

		await browser.close();
		});
	}
);
*/