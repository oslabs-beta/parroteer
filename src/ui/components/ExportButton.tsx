import exportToFile from '../../app/modules/textExporter';

interface ExportButtonProps {
  text: string
}

export default function ExportButton({ text }: ExportButtonProps) {
  const handleExport = () => {
    exportToFile(text, 'test.js');
  };

  return (
    <>
      <button className="export-btn" onClick={handleExport}>
        <i className="export-icon material-symbols-outlined">file_download</i>
      </button>
      <p> Export test file</p>
    </>
  );
}
