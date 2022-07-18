import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { useEffect, useState } from 'react';


const TestsView = () => {

  const [tests, setTests] = useState('');

  // useEffect()

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