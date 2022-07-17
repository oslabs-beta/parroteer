import { UserInputEvent, MutationEvent } from '../../types/Events';

interface TextProps {
  events: (UserInputEvent | MutationEvent)[];
}

const TextList = (props :TextProps) => {
  console.log('list', props);

  const textItems = props.events.map((event:UserInputEvent | MutationEvent) => {
    // const {type, initialSelector, parroteerId} = event;
    //  return <li></li>
  })

  return (
    <ul>
      {textItems}
    </ul>
  )
}

export default TextList;


