import createTestsFromEvents, { indent } from '../src/app/modules/generateTests';
import endent from 'endent';
import { UserInputEvent, PickedElementEvent, MutationEvent, StoredEvent } from '../src/types/Events';

const debugScript = endent`
  await page.evaluate(() => {
    document.querySelector('#cover').addEventListener('click', () => {
      document.querySelector('#cover > p').classList.add('test');
      document.querySelector('#cover > h1').classList.add('test');
      document.querySelector('#cover > h1').innerText = 'hi';
    });
  });
`;
const testURL = 'https://eloquentjavascript.net';

const pickedElementEvent1: PickedElementEvent = {
  type: 'picked-element',
  selector: '#cover > p',
  parroteerId: 'f064152d-766c-4b5f-be3f-e483cfee07c7',
  displaySelector: ''
};
const pickedElementEvent2: PickedElementEvent = {
  type: 'picked-element',
  selector: '#cover > h1',
  parroteerId: '345bb623-0069-4c5c-9dbd-ce3faaa8f50e',
  displaySelector: ''
};
const inputEvent1: UserInputEvent = {
  type: 'input',
  eventType: 'click',
  parroteerId: '',
  selector: '#cover > h1',
  displaySelector: ''
};
const mutationEvent1: MutationEvent = {
  type: 'mutation',
  class: 'test',
  parroteerId: 'f064152d-766c-4b5f-be3f-e483cfee07c7',
  selector: '',
  displaySelector: ''
};
const mutationEvent2: MutationEvent = {
  type: 'mutation',
  class: 'test',
  textContent: 'hi',
  parroteerId: '345bb623-0069-4c5c-9dbd-ce3faaa8f50e',
  selector: '',
  displaySelector: ''
};

describe('Basic test generation', () => {
  it('should generate basic test setup', () => {
    const imports = `const puppeteer = require('puppeteer');`;
    const describe = endent`
      describe('End-to-end test', () => {
        /** @type {puppeteer.Browser} */ let browser;
        /** @type {puppeteer.Page} */ let page;
    `;
    const before = endent`
      beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
      });
  `;
    const testBlock = endent`
      it('passes this test', async () => {
        await page.goto('${testURL}');
        // Temporary variable to store elements when finding and making assertions
        let element;
    `;
    const teardown = endent`
      afterAll(async () => {
        await browser.close();
      });
    `;

    const generatedTests = createTestsFromEvents([], testURL, debugScript);
    expect(generatedTests).toMatch(codeToRegex(imports));
    expect(generatedTests).toMatch(codeToRegex(describe));
    expect(generatedTests).toMatch(codeToRegex(before, 1));
    expect(generatedTests).toMatch(codeToRegex(testBlock, 1));
    expect(generatedTests).toMatch(codeToRegex(teardown, 1));
  });

  it('should display comment when events is empty', () => {
    const noEventText = '// No events were recorded';
    const generatedTests = createTestsFromEvents([], testURL, debugScript);
    // console.log(generatedTests);
    expect(generatedTests).toMatch(codeToRegex(noEventText));
  });

  it('should generate a proper test for a simple set of events', () => {
    const events: StoredEvent[] = [pickedElementEvent1, pickedElementEvent2, inputEvent1, mutationEvent1, mutationEvent2];
    
    const testScript = endent`
      await page.waitForSelector('#cover > p').then((el) => {
        el.evaluate(el => el.dataset.parroteerId = 'f064152d-766c-4b5f-be3f-e483cfee07c7');
      });
      await page.waitForSelector('#cover > h1').then((el) => {
        el.evaluate(el => el.dataset.parroteerId = '345bb623-0069-4c5c-9dbd-ce3faaa8f50e');
      });
      await page.waitForSelector('#cover > h1').then(el => el.click());
      element = await page.$('[data-parroteer-id="f064152d-766c-4b5f-be3f-e483cfee07c7"]');
      expect(getProp(element, 'class')).resolves.toEqual('test');
      element = await page.$('[data-parroteer-id="345bb623-0069-4c5c-9dbd-ce3faaa8f50e"]');
      expect(getProp(element, 'class')).resolves.toEqual('test');
      expect(getProp(element, 'textContent')).resolves.toEqual('hi');
    `;

    const generatedTests = createTestsFromEvents(events, testURL, debugScript);
    console.log(generatedTests);
    expect(generatedTests).toMatch(codeToRegex(testScript, 2));
  });
  
  // TODO: Set up jest-puppeteer and assert that the code is valid and runs properly
});

/**
 * Escapes a string for use in a regular expression
 */
// Big thanks to coolaj86 on StackOverflow for this! https://stackoverflow.com/a/6969486/12033249
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Converts a block of code into an escaped regular expression, with optional indentation
 */
function codeToRegex(string: string, tabs = 0, tabSize = 2) {
  const indented = indent(string, tabs, tabSize)
  return new RegExp(escapeRegExp(indented));
}