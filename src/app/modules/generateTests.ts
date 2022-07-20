import endent from 'endent';
import {PickedElementEvent, MutationEvent, UserInputEvent, StoredEvent } from '../../types/Events';

/**
 * Creates a full test from an array of StoredEvents
 */
export default function createTestsFromEvents(events: StoredEvent[], url = 'http://localhost:8080', debugScripts = '') {
  const imports = 'const puppeteer = require(\'puppeteer\');';
  const header = endent`
    describe('End-to-end test', () => {
      /** @type {puppeteer.Browser} */ let browser;
      /** @type {puppeteer.Page} */ let page;
    
      beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
      });

      it('passes this test', async () => {
        await page.goto('${url}');
        // Temporary variable to store elements when finding and making assertions
        let element;
`;

  const footer =
`  });

  afterAll(() => {
    await browser.close();
  });
});
`;

  const getPropFunc = endent`
    /**
     * Gets the value of a property from an Puppeteer element.
     * @param {puppeteer.ElementHandle<Element>} element
     * @param {puppeteer.HandleOr<keyof Element> | 'class'} property Passing in 'class' will return the full class string.
     */
    async function getProp(element, property) {
      switch (property) {
        case 'class':
          return await element.getProperty('classList').then(cL => cL.getProperty('value')).then(val => val.jsonValue());
        default:
          return await element.getProperty(property).then(val => val.jsonValue());
      }
    }
  `;

  const debug = debugScripts && endent`
    // Debug start
    ${debugScripts}
    // Debug end
  `;

  const formattedEvents: string[] = [];
  for (const event of events) {
    const {type} = event;
    // logic for events using puppeteer to simulate user clicks
    switch (type) {
      case 'input':
        formattedEvents.push(puppeteerEventOutline(event as UserInputEvent));
        break;
      case 'mutation':
        formattedEvents.push(jestOutline(event as MutationEvent));
        break;
      case 'picked-element':
        formattedEvents.push(pickEvent(event as PickedElementEvent));
        break;
      default:
        console.log(`how did ${type} get in here???`);
        break;
    }
  }

  const eventsSection = formattedEvents.length > 0 ? formattedEvents.join('\n') : '// No events were recorded';

  const fullScript = endent`
    ${imports}

    ${header}
    ${debug && indent('\n' + debug + '\n', 2)}
    ${indent(eventsSection, 2)}
    ${footer}

    ${getPropFunc}
  `;
  return fullScript;
}

/**
 * Finds the element associated with the provided MutationEvent
 * and generates Jest `expect` statements for each change
 */
const jestOutline = (event: MutationEvent) => {
  const expectations: string[] = [];
  const checkProps = ['textContent', 'value', 'class'];
  for (const prop in event) {
    if (!checkProps.includes(prop)) continue;
    expectations.push(`expect(getProp(element, '${prop}')).resolves.toEqual('${event[prop as keyof MutationEvent]}');`);
  }

  const expectStr = endent`
    element = await page.$('[data-parroteer-id="${event.parroteerId}"]');
    ${expectations.join('\n')}
  `;
  return expectStr;
};


/**
 * Finds the element associated with the provided UserInputEvent
 * and mimics the input event that happened with it using Puppeteer
 */
const puppeteerEventOutline = (event: UserInputEvent) => {
  const { selector } = event;
  let puppetStr;
  if (event.eventType === 'click') {
    puppetStr = endent`
      await page.waitForSelector('${selector}').then(el => el.click());
    `;
  }
  else puppetStr = `await page.keyboard.press('${event.key}')`;
  return puppetStr;
};

/**
 * Finds the element associated with a PickedElementEvent
 * and assigns it the parroter Id that it should have
 */
const pickEvent = (event: PickedElementEvent) => {
  const pickStr = endent`
    await page.waitForSelector('${event.selector}').then((el) => {
      el.evaluate(el => el.dataset.parroteerId = '${event.parroteerId}');
    });
  `;
  return pickStr;
};

/**
 * Indents a block of text (per line) by the specified amount of 'tabs' (using spaces)
 * @param text
 * @param tabs The number of tabs to indent by
 * @param tabSize How many spaces a tab should be
 * @returns
 */
export function indent(text: string, tabs = 0, tabSize = 2) {
  const lines = text.split('\n');
  return lines.map(line => ' '.repeat(tabSize).repeat(tabs) + line).join('\n');
}