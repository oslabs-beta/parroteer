import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';


const TestsView = () => {

  return (
    <section id="testsView">
      <CodeMirror
        placeholder={'//No tests yet :('}
        value={'hello'}
        theme={dracula}
        height='400px'
        width='400px'
        extensions={[javascript({ jsx: true })]}
      />
    </section>);
};

export default TestsView;