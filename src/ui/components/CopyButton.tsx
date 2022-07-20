interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  const handleClick = () => navigator.clipboard.writeText(text);

  return (
    <button className="icon copy hov copy-btn" onClick={handleClick}>
      <i className="export-icon material-symbols-outlined">content_copy</i>
    </button>
  );
}