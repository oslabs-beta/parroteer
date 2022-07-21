import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import CopyButton from '../components/CopyButton';
import ExportButton from '../components/ExportButton';
import { useEffect, useState } from 'react';

interface testProps {
  tests: string,
  setTests?: (string: string) => void
}

const TestsView = (props: testProps) => {
  const {tests} = props;
  const [newTests, setNewTests] = useState('');
  const [isLoaded, setisLoaded] = useState(false);
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'get-tests' }).then((res) => {
      setNewTests(res);
    });
    setisLoaded(true);
  }, []);

  return ( isLoaded ?
    <section id="testsView">
      <div className="actionBtns">
        <ExportButton text={newTests} />
      </div>
      <CodeMirror
        placeholder={'//No tests yet :('}
        value={newTests}
        theme={dracula}
        height='300px'
        width='400px'
        extensions={[javascript({ jsx: true })]}
      />
      <CopyButton text={newTests} />
    </section> : <section id='testView'></section>);
};

export default TestsView;