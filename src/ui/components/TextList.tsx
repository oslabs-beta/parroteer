interface TextProps {
  children?: JSX.Element | JSX.Element[]
}

const TextList = ({ children }: TextProps) => {
  // TODO: Add styling and scrolling
  return (
    <ul className="scroll-list">
      {children}
    </ul>
  );
};

export default TextList;



