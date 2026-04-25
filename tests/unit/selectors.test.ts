import { describe, expect, it } from 'vitest';
import { chooseSelector } from '../../src/core/selectors/chooseSelector';

describe('chooseSelector', () => {
  it('prefers test id selectors', () => {
    document.body.innerHTML = '<button data-testid="save-button">Save</button>';
    expect(chooseSelector(document.querySelector('button')!)).toBe('page.getByTestId("save-button")');
  });

  it('uses labels for form controls', () => {
    document.body.innerHTML = '<label for="email">Email</label><input id="email" />';
    expect(chooseSelector(document.querySelector('input')!)).toBe('page.getByLabel("Email")');
  });
});
