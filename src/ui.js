// Module to build UI components with applicable Bootstrap classes

function listItem(Todo, listIndex) {
    const entryContainer  = document.createElement('li');
    entryContainer.setAttribute('class', 'todo-entry list-group-item');

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

    for (let i = 0; i < todoList.size; i++) {
        domList.appendChild(listItem(todoList.list[i], i));
        console.log("Entry added: " + JSON.stringify(todoList.list[i])); //Console Sanity check
    }

    listContainer.appendChild(domList);
    return listContainer;
}