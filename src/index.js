// Import our custom CSS
import './scss/styles.scss'
// Import all of Bootstrap's JS -- NOTE: We maaay not need this, check back later
import * as bootstrap from 'bootstrap'

import { Todo } from "./todo";
import { list } from "./ui";

  // To-Do Item DOM manupulation to add entries onto our page
  //hardcoded for now 
  const container = document.querySelector('.container');

  const item1 = new Todo('Clean Kitchen');
  const item2 = new Todo('Do Taxes');
  const item3 = new Todo('Plot World Domination');

  const myList = [];
  myList.push(item1, item2, item3);

  container.appendChild(list(myList, 'Default List'));