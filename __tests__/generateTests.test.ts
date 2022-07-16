import createTestsFromEvents from '../src/app/modules/generateTests';
import endent from 'endent';
import { UserInputEvent, PickedElementEvent, MutationEvent, StoredEvent } from '../src/types/Events';

describe('Basic test generation', () => {
  it('should generate basic test setup with no inputs', () => {
    const testResult = endent`
      const puppeteer = require('puppeteer');

      describe('End-to-end test', () => {
        it('passes this test', async () => {
          const browser = await puppeteer.launch({ headless: false });
          const page = await browser.newPage();
          await page.goto('http://localhost:8080');


          await browser.close();
        });
      });
    `;
    expect(createTestsFromEvents([])).toEqual(testResult);
  });

  it('should generate a test for an event list with 1 picked-element event, 1 input event, and 1 mutation event', () => {
    const inputEvent: UserInputEvent = {
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
    
    const testResult = endent`
      const puppeteer = require('puppeteer');

      describe('End-to-end test', () => {
        it('passes this test', async () => {
          const browser = await puppeteer.launch({ headless: false });
          const page = await browser.newPage();
          await page.goto('http://localhost:8080');

          await page.waitFor("#test > div").then(el => el.dataset.parroteerId = "980458ad3-adsf34-df342-adsf898f");
          await page.click('[data-parroteer-id="980458ad3-adsf34-df342-adsf898f"]');
          await page.waitFor('[data-parroteer-id="980458ad3-adsf34-df342-adsf898f"]').then(el => {
            expect(el.textContent).toEqual('hi');
            expect(el.classList.value).toEqual('class1 class2');
          });

          await browser.close();
        });
      });
    `;
    expect(createTestsFromEvents(events)).toEqual(testResult);
  });
});