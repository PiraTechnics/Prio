// Module to build UI components with applicable Bootstrap classes

function listItem(Todo, listIndex) {
    const entryContainer  = document.createElement('li');
    entryContainer.setAttribute('class', 'todo-entry list-group-item');

    //Need to flesh out setting the DOM elements here
    // See Biblog for example of using Bootstrap to create a well-formatted table
    // Also check UI examples from popular to-do apps for inspiration
    //Consider Tailwind CSS/UI if necessary (Bootstrap also good)

    const entryId = 'checkbox-' + listIndex;

    const checkbox = document.createElement('input');
    checkbox.setAttribute('class', 'form-check-input ms-1 me-3');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('vlaue', '');
    checkbox.setAttribute('id', entryId);

    const checkLabel = document.createElement('label');
    checkLabel.setAttribute('class', 'form-check-label');
    checkLabel.setAttribute('for', entryId);
    checkLabel.innerText = Todo.title;

    entryContainer.append(checkbox, checkLabel);

    //entryContainer.appendChild(document.createTextNode(Todo.title));

    return entryContainer;
}

export function list(todoList, name) {
    const listContainer = document.createElement('div');
    listContainer.setAttribute('class', 'listContainer');
    const listHeader = document.createElement('p');
    listHeader.setAttribute('class', 'h3 text-center listHeader');
    listHeader.appendChild(document.createTextNode(name));
    listContainer.appendChild(listHeader);

    const domList = document.createElement('ul');
    domList.setAttribute('class', 'list-group list-group-flush m-2');

    /*todoList.forEach(listEntry => {
        domList.appendChild(listItem(listEntry));
    });*/

    for (let i = 0; i < todoList.length; i++) {
        domList.appendChild(listItem(todoList[i], i));
    }

    listContainer.appendChild(domList);

    return listContainer;
}