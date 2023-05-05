// Module for localStorage Manipulation

export function createNewTodo(todo) {
    let key = localStorage.length;
    localStorage.setItem(key, JSON.stringify(todo));
}

export function readTodo(key) {
    //Returns a string, must be converted to ToDo instance
    return JSON.parse(localStorage.getItem(key));
}

export function updateTodo(key, todo) {
    localStorage.removeItem(key);
    localStorage.setItem(key, todo);
}

export function deleteTodo(key) {
    localStorage.removeItem(key);
}