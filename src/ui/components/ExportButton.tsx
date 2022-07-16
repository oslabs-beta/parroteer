interface ExpectButtonProps {
  onExport: () => void
}

export default function ExpectButton({ onExport }: ExpectButtonProps) {
  return (
    <button onClick={onExport}>
      <img src='./icons/file_export.png'/>
    </button>
  );
}