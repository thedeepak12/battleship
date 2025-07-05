import './style.css';
import { DOM } from './modules/dom';

const init = () => {
  const dom = DOM();
  dom.initialize();
};

document.addEventListener('DOMContentLoaded', init);
