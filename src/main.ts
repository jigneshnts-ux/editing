import './styles/globals.css';
import { App } from './App';

const mount = document.getElementById('root');

if (!mount) {
  throw new Error('CreatorX root element was not found.');
}

mount.innerHTML = '';
mount.appendChild(App());
