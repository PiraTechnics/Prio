// Module to build UI components with applicable Bootstrap classes

function listItem(Todo, listIndex) {
    const entryContainer = document.createElement('tr');
    const entryCheckBox = createTableRowElement(createCheckBox(listIndex), 'td');
    const entryTitle = createTableRowElement(document.createTextNode(Todo.title), 'td');
    const entryDue = createTableRowElement(document.createTextNode(Todo.dueDate), 'td');
    const entryImp = createTableRowElement(document.createTextNode(Todo.priority), 'td');
    const entryUrg = createTableRowElement(document.createTextNode(Todo.urgent), 'td');
    entryContainer.append(entryCheckBox, entryTitle, entryDue, entryImp, entryUrg);

    return entryContainer;
}

function createTableRowElement(entry, type, scope) {
    const element = document.createElement(type);
    element.setAttribute('scope', scope);
    element.appendChild(entry);

    return element;
}

function createCheckBox(listIndex) {
    const checkContainer = document.createElement('div');
    checkContainer.setAttribute('class', 'form-check');
    
    const checkBox = document.createElement('input');
    checkBox.setAttribute('class', 'form-check-input ms-1 me-3');
    checkBox.setAttribute('type', 'checkBox');
    checkBox.setAttribute('vlaue', '');

    if(!listIndex) {
        const id = 'checkbox-' + listIndex;
        checkBox.setAttribute('id', id);
    }
    else {
        checkBox.setAttribute('id', 'placeholder');
    }

    checkContainer.append(checkBox);
    return checkContainer;
}

export function list(todoList, name) {
    const listContainer = document.createElement('div');
    listContainer.setAttribute('class', 'listContainer');

    //Create Table and link structure in DOM
    const table = document.createElement('table');
    table.setAttribute('class', 'table');
    
    //Create Table Header and link Elements in DOM
    const th = document.createElement('thead');
    const thRow = document.createElement('tr');
    th.append(thRow);
    table.append(th);

    //Create and add Header Row to Table
    const checkBox = createCheckBox('placeholder');
    checkBox.classList.add('invisible');
    const checkKey = createTableRowElement(checkBox, 'th', 'col');
    const itemKey = createTableRowElement(document.createTextNode('Item'), 'th', 'col');
    const dueDateKey = createTableRowElement(document.createTextNode('Due'), 'th', 'col');
    const impKey = createTableRowElement(document.createTextNode('Important'), 'th', 'col');
    const urgKey = createTableRowElement(document.createTextNode('Urgent'), 'th', 'col');
    thRow.append(checkKey, itemKey, dueDateKey, impKey, urgKey);

    //Create Table Body, add list elements to it, and link in DOM
    const tBody = document.createElement('tbody');
    tBody.setAttribute('class', 'table-group-divider');
    table.append(tBody);

    for(let i = 0; i < todoList.length; i++) {
        tBody.appendChild(listItem(todoList[i], i));
        console.log("Entry added: " + JSON.stringify(todoList[i]));
    }

    listContainer.appendChild(table);
    return listContainer;
}