import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';

(function main() {
  const root = document.getElementById('root');

  if (root === null) {
    throw new Error('Root element not found');
  }

  ReactDOM
    .createRoot(root)
    .render(App());
})()