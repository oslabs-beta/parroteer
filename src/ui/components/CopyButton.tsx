interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  const handleClick = () => navigator.clipboard.writeText(text);

  return (
    <button className="icon hov" onClick={handleClick}>
      <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 7H7V5H13V7Z" fill="currentColor"></path>
        <path d="M13 11H7V9H13V11Z" fill="currentColor"></path>
        <path d="M7 15H13V13H7V15Z" fill="currentColor"></path>
        <path clipRule="evenodd" d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z" fill="currentColor" fillRule="evenodd"></path>
      </svg>
    </button>
  );
}