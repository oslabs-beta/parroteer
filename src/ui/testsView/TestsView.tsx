import ExportButton from '../components/ExportButton';

const TestsView = () => {
  const test = 'hello!';
  return (
    <section id="testsView">
      <p>Tests View</p>
      <ExportButton text={test} />
    </section>);
};

export default TestsView;