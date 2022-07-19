import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import CopyButton from '../components/CopyButton';


const TestsView = () => {

  return (
    <section id="testsView">
      <CodeMirror
        placeholder={'//No tests yet :('}
        value={'hello'} /* DEBUG */
        theme={dracula}
        height='400px'
        width='400px'
        extensions={[javascript({ jsx: true })]}
      />
      <CopyButton text={'hello world!'} /> {/* DEBUG */}
    </section>);
};

export default TestsView;