import exportToFile from '../../app/modules/textExporter';

interface ExportButtonProps {
  text: string
}

export default function ExportButton({ text }: ExportButtonProps) {
  const handleExport = () => {
    exportToFile(text, 'test.js');
  };

  return (
    <button className='export hov' onClick={handleExport}>
      <img src='./icons/file_export.png'/>
    </button>
  );
}