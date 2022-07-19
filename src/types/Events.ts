export interface StoredEvent {
  type: 'input' | 'mutation' | 'picked-element',
  parroteerId: ParroteerId,
  selector: CssSelector,
  displaySelector: CssSelector,
  timestamp?: number
}

export interface MutationEvent extends Partial<ElementState>, StoredEvent {
  type: 'mutation'
}

export interface UserInputEvent extends StoredEvent {
  type: 'input',
  eventType: string,
  key?: string,
  code?: string,
  shift?: boolean
}

export interface PickedElementEvent extends StoredEvent {
  type: 'picked-element'
}

export type CssSelector = string;

export type ParroteerId = string;

export interface ElementState {
  class?: string,
  textContent?: string,
  value?: string
}

export type RecordingState = 'pre-recording' | 'recording' | 'off';

export type EventLog = (PickedElementEvent | UserInputEvent | MutationEvent)[];