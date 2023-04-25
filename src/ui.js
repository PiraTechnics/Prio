import { Todo } from "./todo";

export function createEntry(Todo) {
    const entryContainer  = document.createElement('div');
    entryContainer.setAttribute('class', 'todo-entry');

    //Need to flesh out setting the DOM elements here
    // See Biblog for example of using Bootstrap to create a well-formatted table
    // Also check UI examples from popular to-do apps for inspiration
    //Consider Tailwind CSS/UI if necessary (Bootstrap also good)
    entryContainer.appendChild(document.createTextNode(Todo.title));

    return entryContainer;
}