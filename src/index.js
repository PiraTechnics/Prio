// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { renderList } from "./listView";
import * as storage from "./listController";

const container = document.querySelector('.container');
container.appendChild(renderList(storage.getAllEntries()));