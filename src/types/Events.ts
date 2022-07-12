export interface StoredEvent {
  selector: string,
  timestamp?: number,
  type: 'input' | 'mutation',
}

export interface MutationEvent extends Partial<ElementState>, StoredEvent {}

export interface UserInputEvent extends StoredEvent {
  eventType: string
}

export type CSSSelector = string;

export interface ElementState {
  class?: string,
  textContent?: string,
  value?: string
}

export type RecordingState = 'pre-recording' | 'recording' | 'off';