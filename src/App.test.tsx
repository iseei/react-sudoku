import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { expect, it } from 'vitest';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(div.querySelectorAll('.cell')).toHaveLength(81);
  ReactDOM.unmountComponentAtNode(div);
});
