import { Todo } from "./todo";
import { createEntry } from "./ui";

function index() {
    const element = document.createElement('div');
    element.setAttribute('class', 'container');
    element.innerHTML = 'Hello Webpack!';
  
    return element;
  }
  
  document.body.appendChild(index());

  // To-Do Item DOM manupulation to add entries onto our page
  //hardcoded for now 
  const container = document.querySelector('.container');
  container.appendChild(createEntry(new Todo('Blah')))