import endent from 'endent';
import {PickedElementEvent, MutationEvent, UserInputEvent, StoredEvent } from '../../types/Events';

const importPuppeteer = 'const puppeteer = require(\'puppeteer\');';
const header = endent`
  describe('This is a unit test', () => {
    it('passes this test', async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('http://localhost:8080');
`;
// TODO: capture url in background

const footer =
`    await browser.close();
  });
});`;

/**
 * Finds the element associated with the provided MutationEvent
 * and generates Jest `expect` statements for each change
 */
const jestOutline = (event: MutationEvent) => {
  let change;
  
  const expectations: string[] = [];
  for (const key in event) {
    if (key === 'textContent') change = 'textContent';
    else if (key === 'value') change = 'value';
    else if(key === 'class') change = 'classList.value';
    else continue;
    expectations.push(`expect(el.${change}).toEqual('${event[key]}');`);
  }

  const expectStr = endent`
    await page.waitFor('[data-parroteer-id="${event.parroteerId}"]').then(el => {
      ${expectations.join('\n')}
    });
  `;
  return indent(expectStr, 2);
  // return waitFor + `\t\tawait expect(${event.parroteerId}).${change});\n`;
};

// console.log(jestOutline({ type: 'mutation', parroteerId: '90435034905-fasdf-43tfdg-34trq3gngiogn', textContent: 'hi', class: 'testclass' }));


/**
 * Finds the element associated with the provided UserInputEvent
 * and mimics the input event that happened with it using Puppeteer
 */
const puppeteerEventOutline = (event: UserInputEvent) => {
  const eventType = (event.eventType === 'click' ? 'click' : 'keyboard.press');
  const puppetStr = `await page.${eventType}('[data-parroteer-id="${event.parroteerId}"]');`;
  return indent(puppetStr, 2);
};

/**
 * Finds the element associated with a PickedElementEvent
 * and assigns it the parroter Id that it should have
 */
const pickEvent = (event: PickedElementEvent) => {
  return `await page.waitFor("${event.initialSelector}").then(el => el.dataset.parroteerId = "${event.parroteerId}")`;
};

/**
 * Creates a full test from a set of Events
 */
export default function createTestsFromEvents(events: StoredEvent[]) {
  const outputSections: string[] = [];
  outputSections.push(importPuppeteer, header);

  for (const event of events) {
    const {type} = event;
    // logic for events using puppeteer to simulate user clicks
    switch (type) {
      case 'input':
        outputSections.push(puppeteerEventOutline(event as UserInputEvent));
        break;
      case 'mutation':
        outputSections.push(jestOutline(event as MutationEvent));
        break;
      case 'picked-element':
        outputSections.push(pickEvent(event as PickedElementEvent));
        break;
      default:
        console.log(`how did ${type} get in here???`);
        break;
    }
  }

  outputSections.push(footer);
  return outputSections.join('\n');
}

function indent(str: string, tabs = 0) {
  const lines = str.split('\n');
  return lines.map(line => '\t'.repeat(tabs) + line).join('\n');
}

/* const inputEvent: UserInputEvent = {
  type: 'input',
  eventType: 'click',
  parroteerId: '980458ad3-adsf34-df342-adsf898f',
  selector: '#test > div'
};
const mutationEvent: MutationEvent = {
  type: 'mutation',
  textContent: 'hi',
  class: 'class1 class2',
  parroteerId: '980458ad3-adsf34-df342-adsf898f'
};
const pickedElementEvent: PickedElementEvent = {
  type: 'picked-element',
  initialSelector: '#test > div',
  parroteerId: '980458ad3-adsf34-df342-adsf898f'
};

const events: StoredEvent[] = [pickedElementEvent, inputEvent, mutationEvent];
console.log(createTestsFromEvents(events)); */
  
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