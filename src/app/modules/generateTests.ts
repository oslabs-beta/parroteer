import endent from 'endent';
import {PickedElementEvent, MutationEvent, UserInputEvent, StoredEvent } from '../../types/Events';

/**
 * Creates a full test from an array of StoredEvents
 */
export default function createTestsFromEvents(events: StoredEvent[], url = 'http://localhost:8080') {
  const importPuppeteer = 'const puppeteer = require(\'puppeteer\');';
  const header = endent`
    describe('End-to-end test', () => {
      it('passes this test', async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('${url}');
  `;
  // TODO: capture url in background
  
  const footer =
`    await browser.close();
  });
});`;

  const outputSections: string[] = [];
  outputSections.push(importPuppeteer + '\n', header + '\n');

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

  outputSections.push('\n' + footer);
  return outputSections.join('\n');
}

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
    await page.waitForSelector('[data-parroteer-id="${event.parroteerId}"]').then(el => {
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
  let eventType;
  if (event.eventType === 'click') eventType = `click('[data-parroteer-id="${event.parroteerId}"]')`;
  else eventType = `keyboard.press('${event.key}')`;
  const puppetStr = `await page.${eventType};`;
  return indent(puppetStr, 2);
};

/**
 * Finds the element associated with a PickedElementEvent
 * and assigns it the parroter Id that it should have
 */
const pickEvent = (event: PickedElementEvent) => {
  const pickStr = `await page.waitForSelector("${event.initialSelector}").then(el => el.dataset.parroteerId = "${event.parroteerId}");`;
  return indent(pickStr, 2);
};

/**
 * Indents a block of text (per line) by the specified amount of 'tabs' (using spaces)
 * @param text 
 * @param tabs The number of tabs to indent by
 * @param tabSize How many spaces a tab should be
 * @returns 
 */
function indent(text: string, tabs = 0, tabSize = 2) {
  const lines = text.split('\n');
  return lines.map(line => ' '.repeat(tabSize).repeat(tabs) + line).join('\n');
}