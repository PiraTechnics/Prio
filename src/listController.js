// Module for localStorage Manipulation
import { Todo } from "./todoModel";

export function createTodo(title, description, dueDate, priority, urgency) {
    const key = localStorage.length;
    const todo = new Todo(title, description, dueDate, priority, urgency);
    localStorage.setItem(key, JSON.stringify(todo));
}

export function readTodo(key) {
    //Returns a ToDo object
    return Todo.fromJSON(JSON.parse(localStorage.getItem(key)));
}

export function updateTodo(key, todo) {
    localStorage.setItem(key, todo);
}

export function deleteTodo(key) {
    localStorage.removeItem(key);
}

export function getAllEntries() {
    let entries = [];
    for(let i=0; i < localStorage.length; i++) {
        entries.push(readTodo(i));
    }
    return entries;
}

export function submitChanges(form, index) {
    //Note: we should sanitize input and sanity check for 'no-change'

    const name = form.querySelector('#entryName').value;
    const details = form.querySelector('#entryDescription').value;
    const date = form.querySelector('#entryDueDate').value.replaceAll('-', '/');
    const important = form.querySelector('#entryPriority').checked;
    const urgent = form.querySelector('#entryUrgency').checked;

    if(index == -1) {
        createTodo(name, details, date, important, urgent);
        form.reset();
    }

    else if(!isNaN(index)) { //confirm it's a number
        //Note: Should check to make sure something changed if we are updating
        updateTodo(index, JSON.stringify(new Todo(name, details, date, important, urgent)));
    }

    return false;
}