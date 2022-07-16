interface WrongTabProps {
    recordingTab: number,
    setOnCorrectTab: (str: boolean) => void,
  }

const WrongTab = (props: WrongTabProps) => {
  const {recordingTab, setOnCorrectTab} = props;

  const handleEndSession = () => {
    chrome.runtime.sendMessage({ type: 'stop-recording' });
    setOnCorrectTab(true);
  };

  const handleGoToRecordingTab = () => {
    chrome.tabs.update(recordingTab, {active: true});
  };

  return (
    <main className="wrong-tab-page">
      <p>You&#8217;re crrently recording somewhere else!!!</p>
      <p>Please navigate back to that tab :)</p>
      <img src='./icons/parrot_48.png' alt="parrot" />
      <button onClick={handleGoToRecordingTab}>find it for me pls</button>
      <button onClick={handleEndSession}>End recording session on that tab</button>
    </main>
  );
};

export default WrongTab;