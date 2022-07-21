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
      <img src='./icons/parrot_48.png' alt="parrot" />
      <div className="wrongTab-wrapper">
        <p>Oops!</p>
        <p>You are recording on a different tab.</p>
        <p><b>Please navigate back to that tab to continue your recording session.</b></p>
      </div>
      <button className="findTab-btn" onClick={handleGoToRecordingTab}>Take me to my tab</button>
      <button className="endTabSession-btn" onClick={handleEndSession}>End recording session on tab</button>
    </main>
  );
};

export default WrongTab;