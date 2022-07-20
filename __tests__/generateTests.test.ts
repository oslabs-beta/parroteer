import createTestsFromEvents, { indent } from '../src/app/modules/generateTests';
import endent from 'endent';
import { UserInputEvent, PickedElementEvent, MutationEvent, StoredEvent } from '../src/types/Events';

const debugScript = endent`
  await page.evaluate(() => {
    document.querySelector('#cover').addEventListener('click', () => {
      document.querySelector('#cover > p').classList.toggle('test');
      document.querySelector('#cover > h1').innerText = 'hi';
    });
  });
`;
const testURL = 'https://eloquentjavascript.net';

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function stripWhitespace(string: string) {
  return string.replace(/\s*/g, '');
}

function regexCode(string: string, tabs = 0, tabSize = 2) {
  const indented = indent(string, tabs, tabSize)
  return new RegExp(escapeRegExp(indented));
}

/* function escapeCode(string: string) {
  return 
} */

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
        await page.goto('http://localhost:8080');
        // Temporary variable to store elements when finding and making assertions
        let element;
    `;
    const teardown = endent`
      afterAll(() => {
        await browser.close();
      });
    `;

    const generatedTests = createTestsFromEvents([], testURL, debugScript);
    console.log(describe);
    console.log(escapeRegExp(generatedTests));
    console.log(!!generatedTests.match(describe));
    
    expect(generatedTests).toMatch(regexCode(imports));
    expect(generatedTests).toMatch(regexCode(describe));
    expect(generatedTests).toMatch(regexCode(before, 1));
    expect(generatedTests).toMatch(indent(testBlock, 1));
    expect(generatedTests).toMatch(indent(teardown, 1));
  });

  it('should display comment when tests events is empty', () => {
    const noEventText = '// No events were recorded';
    const generatedTests = createTestsFromEvents([], testURL, debugScript);
    // console.log(generatedTests);
    expect(generatedTests).toMatch(noEventText);
  });

  it('should generate a test for an event list with 1 picked-element event, 1 input event, and 1 mutation event', () => {
    const inputEvent: UserInputEvent = {
      type: 'input',
      eventType: 'click',
      parroteerId: '980458ad3-adsf34-df342-adsf898f',
      selector: '#test > div',
      displaySelector: ''
    };
    const mutationEvent: MutationEvent = {
      type: 'mutation',
      textContent: 'hi',
      class: 'class1 class2',
      parroteerId: '980458ad3-adsf34-df342-adsf898f',
      selector: '',
      displaySelector: ''
    };
    const pickedElementEvent: PickedElementEvent = {
      type: 'picked-element',
      selector: '#test > div',
      parroteerId: '980458ad3-adsf34-df342-adsf898f',
      displaySelector: ''
    };
    
    const events: StoredEvent[] = [pickedElementEvent, inputEvent, mutationEvent];
    
    const testScript = endent`
      await page.waitForSelector('#test > div').then((el) => {
        el.evaluate(el => el.dataset.parroteerId = '980458ad3-adsf34-df342-adsf898f');
      });
      await page.waitForSelector('#test > div').then(el => el.click());
      element = await page.$('[data-parroteer-id="980458ad3-adsf34-df342-adsf898f"]');
      expect(getProp(element, 'textContent')).resolves.toEqual('hi');
      expect(getProp(element, 'class')).resolves.toEqual('class1 class2');
    `;

    const generatedTests = createTestsFromEvents(events, testURL, debugScript);
    // console.log(generatedTests);
    expect(generatedTests).toMatch(indent(testScript, 2));
  });
});