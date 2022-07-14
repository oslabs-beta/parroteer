export interface StoredEvent {
  selector: CssSelector,
  parroteerId: ParroteerId,
  timestamp?: number,
  type: 'input' | 'mutation',
}

export interface MutationEvent extends Partial<ElementState>, StoredEvent {}

export interface UserInputEvent extends StoredEvent {
  eventType: string
}

export type CssSelector = string;

export type ParroteerId = string;

export interface ElementState {
  class?: string,
  textContent?: string,
  value?: string
}

export type RecordingState = 'pre-recording' | 'recording' | 'off';