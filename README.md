<!-- parroteer banner -->
### *No-code test automation solution for end-to-end testing*

## Table of Contents
- [About](#about-parroteer)
  - [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Creating tests](#creating-tests)
  - [Running tests](#running-generated-tests)
- [Roadmap](#roadmap)
- [Our Team](#our-team)
- [Contributions](#contributions)
- [License](#license)

<!-- chrome store link -->
## About Parroteer
Parroteer allows you to generate end-to-end tests simply by using your website. Pick the elements you want to watch for changes, interact with your page just as a user would, and have Puppeteer scripts generated for you with built in test assertions using Jest!

### Features
- Select specific elements on the page to observe for changes
- Record user interactions and changes that occur in tracked elements
- Auto-generation of Jest-Puppeteer tests
- View, edit, and copy or download generated code

## Installation
You can find our extension in the Chrome Web Store (coming soon, please see below!) and click "Add to Chrome". Then just pin Parroteer to your extension toolbar and you're ready to go!

Parroteer is currently pending approval on the Chrome Web Store but should be available within a few days! Please check back here soon and we will have a link so that everyone can give it a try 🙂

## Usage
### Creating tests
#### 1. Pick elements to watch
Begin by navigating to the page you want to test, then click the Parroteer icon and select "Pick Elements". Now you can highlight and click the elements on the page that you want to watch for changes.

#### 2. Record!
Once you're ready, you can go forward and start recording! Parroteer will begin tracking your clicks and key-presses on the page, and as any watched elements change, Parroteer will store these changes and create corresponding tests.

If say a new element appears on the page that you want to watch or maybe you realized you forgot one, just click the pause button in the extension popup and go back to pick more elements, then resume recording!

#### 3. View and save tests
When you're all set, just find that friendly little parrot again in your extension bar and click the stop button. From there you can view, edit, and copy or export the Puppeteer scripts and Jest tests that are generated for you!

#### 4. Rinse and repeat
When you're ready to start a new recording session or if at any point you want to cancel your current one, all you need to do is click the restart button in the top right.

### Running generated tests
Configurations for running Jest-Puppeteer tests may vary, but for a basic setup, we recommend the following:
1. Add the generated code as a `[filename].test.ts` file in your project's `__tests__` directory
2. Install [Jest](https://github.com/facebook/jest), [Puppeteer](https://github.com/puppeteer/puppeteer), and [Jest-Puppeteer](https://github.com/smooth-code/jest-puppeteer) via npm
3. In your project's package.json, add the jest-puppeteer preset:
```js
{
  ...
  "jest": {
    "preset": "jest-puppeteer"
  }
}
```
4. Add a `package.json` script to run jest, or use `npx jest` to run the tests!

## Roadmap
There's a lot we'd love to (and plan to!) do with Parroteer! Here's what we've thought of so far:
- Buttons to deselect picked elements and remove recorded events
- Keep all selected elements highlighted while picking elements
- In-browser recording replays via the extension
  - Replay controls such as pausing & stepping forward/back
- Saving and loading of previous tests using Chrome storage
- User settings such as:
  - Allowing custom properties to be specified for observation
  - Customization in how selectors are generated
  - Toggle to watch for all DOM changes instead of specific elements
  - Add additional DOM events that users can opt to listen for
  - Toggle to include delays between user inputs in generated scripts (and replays)

We also know there are further improvements we can make in how element changes are tracked and how the corresponding tests are generated, as well as our codebase as a whole, so we'll keep making adjustments and smoothing things out wherever we can!

## Our Team
<table><tbody><tr>
  <td align="center" width="150">
    <img src="https://user-images.githubusercontent.com/1347847/180048247-6ae956ab-da6a-44dd-b43b-2ccb71414b5e.png" style="height: 5rem; width: 5rem;" />
    <br/>
    <strong>Alex Rokosz</strong>
    <br/>
    <a href="https://github.com/alrokosz">GitHub</a>
    <br/>
    <a href="https://www.linkedin.com/in/alexanderrokosz/">LinkedIn</a>
  </td>
  <td align="center" width="150">
    <img src="https://user-images.githubusercontent.com/1347847/180048245-bd80e3ab-fefd-4290-a5b6-6fb11669eafe.png" style="height: 5rem; width: 5rem;" />
    <br/>
    <strong>Alina Gasperino</strong>
    <br/>
    <a href="https://github.com/Alina207">GitHub</a>
    <br/>
    <a href="https://www.linkedin.com/in/alinagasperino/">LinkedIn</a>
  </td>
  <td align="center" width="150">
    <img src="https://user-images.githubusercontent.com/1347847/180048242-9201e19e-1f29-4dda-97cd-59c32e06767b.png" style="height: 5rem; width: 5rem;" />
    <br/>
    <strong>Eric Wells</strong>
    <br/>
    <a href="https://github.com/epiqu1n/">GitHub</a>
    <br/>
    <a href="https://www.linkedin.com/in/ewells2275/">LinkedIn</a>
  </td>
  <td align="center" width="150">
    <img src="https://user-images.githubusercontent.com/1347847/180048249-2384e70d-8a10-4fc9-b12f-bff75a900ab3.png" style="height: 5rem; width: 5rem;" />
    <br/>
    <strong>Erin Zhuang</strong>
    <br/>
    <a href="https://github.com/erinzz">GitHub</a>
    <br/>
    <a href="https://www.linkedin.com/in/erin-zhuang/">LinkedIn</a>
  </td>
</tr></tbody></table>

## Contributions
We welcome any and all contributions! If you would like to help out by adding new features or fixing issues, please do the following:
1. [Fork](https://github.com/oslabs-beta/parroteer/fork) and clone our repository
2. Run `npm install` to install the necessary dependencies
3. Run `npm run build-watch` to build the project and watch for changes
4. Follow the instructions on [loading unpacked extensions](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) in Chrome
5. Make changes locally on a feature- or bugfix- branch
6. Write unit tests for any new features or components that you create
7. Use `npm test` during development to ensure changes are non-breaking
8. Finally when you're done, push your branch to your fork and create a pull request!

Whenever you make changes to your code while running the `build-watch` script, Webpack will automatically rebuild the project. However, in order to see these changes in your extension you must reload the extension in Chrome, then refresh any pages you wish to use it with so that the content scripts are reloaded as well.

We use a custom eslint configuration and would greatly appreciate that all contributors adhere to the defined styling rules, and please try to follow similar coding patterns as those you may see in this repository 🙂

## License
This software is provided under the [MIT License](LICENSE.md).
