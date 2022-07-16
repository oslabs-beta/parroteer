import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';


const TestsView = () => {
  const tests = `const puppeteer = require('puppeteer');
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
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      blah
      });
    }
  );`;

  return (
    <section id="testsView">
      <CodeMirror
        placeholder={'//No tests yet :('}
        value={tests}
        theme={dracula}
        height='400px'
        width='400px'
        extensions={[javascript({ jsx: true })]}
      />
    </section>);
};

export default TestsView;