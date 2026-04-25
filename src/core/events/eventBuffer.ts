import type { RecordingStep } from '../../shared/types';

export function mergeStep(steps: RecordingStep[], nextStep: RecordingStep): RecordingStep[] {
  const previous = steps.at(-1);
  if (previous && previous.type === 'fill' && nextStep.type === 'fill' && previous.selector === nextStep.selector) {
    return [...steps.slice(0, -1), { ...nextStep, id: previous.id }];
  }
  if (previous && previous.type === 'goto' && nextStep.type === 'goto' && previous.url === nextStep.url) return steps;
  return [...steps, nextStep];
}
