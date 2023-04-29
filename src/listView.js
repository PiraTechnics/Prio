// Module to build UI components with applicable Bootstrap classes
import exclamIcon from './assets/exclamation-lg.svg';
import alarmIcon from './assets/alarm.svg';
import chevronExpand from './assets/chevron-expand.svg';

export function renderList(todoList, name) {
    const listContainer = document.createElement('div');
    listContainer.setAttribute('class', 'listContainer');

    const table = renderTableHeader();
    const body = renderTableBody(todoList);

    table.appendChild(body);
    listContainer.appendChild(table);
    
    return listContainer;
}

export function deleteTableRows(tableBody) {
    while(tableBody.firstChild) {
        tableBody.removeChild(tableBody.lastChild);
    }
}

function renderTableHeader() {
        //Create Table and link structure in DOM
        const table = document.createElement('table');
        table.setAttribute('class', 'table');
        
        //Create Table Header and link Elements in DOM
        const th = document.createElement('thead');
        const thRow = document.createElement('tr');
        th.append(thRow);
        table.append(th);
    
        //Create and add Header Row to Table
        const checkBox = renderCheckBox('placeholder');
        checkBox.classList.add('invisible');
        const checkKey = renderRowElement(checkBox, 'th', 'col');
        const itemKey = renderRowElement(document.createTextNode('To-Do'), 'th', 'col');
        itemKey.prepend(renderIcon(chevronExpand, 20, 'unsorted', 'me-1 sortIcon'));
        itemKey.classList.add('align-middle');
        const dueDateKey = renderRowElement(document.createTextNode('Due'), 'th', 'col');
        dueDateKey.prepend(renderIcon(chevronExpand, 20, 'unsorted', 'me-1 sortIcon'));
        dueDateKey.classList.add('align-middle');
        const impKey = renderRowElement(document.createTextNode('Priority'), 'th', 'col');
        impKey.classList.add('align-middle');
        thRow.append(checkKey, itemKey, dueDateKey, impKey);

        return table;
}

function renderTableBody(todoList) {
    //Create Table Body, add list elements to it, and link in DOM
    const tBody = document.createElement('tbody');
    tBody.setAttribute('class', 'table-group-divider');
    
    //Add all entries from list in order
    for(let i = 0; i < todoList.length; i++) {
        tBody.appendChild(renderTableRow(todoList[i], i));
        console.log("Entry added: " + JSON.stringify(todoList[i]));
    }

    return tBody;
}

function renderTableRow(Todo, listIndex) {
    const entryContainer = document.createElement('tr');
    const entryCheckBox = renderRowElement(renderCheckBox(listIndex), 'td');
    const entryTitle = renderRowElement(document.createTextNode(Todo.title), 'td');
    
    // Leave blank if undefined (or other default)
    //TODO: Change to be a date
    const entryDue = renderRowElement(document.createTextNode(Todo.dueDate), 'td');

    // TODO: Render each only IF associated boolean is ticked
    const exclam = renderIcon(exclamIcon, 30, 'Exclamation Mark');
    const alarm = renderIcon(alarmIcon, 25, 'Alarm Clock');

    const impWrapper = document.createElement('div');
    impWrapper.append(exclam, alarm);
    const entryImp = renderRowElement(impWrapper, 'td');

    entryContainer.append(entryCheckBox, entryTitle, entryDue, entryImp);
    entryContainer.classList.add('align-middle');

    return entryContainer;
}

function renderRowElement(entry, type, scope) {
    const element = document.createElement(type);
    
    if(scope) {element.setAttribute('scope', scope)}
    element.appendChild(entry);

    return element;
}

function renderIcon(icon, size, alt='icon', classes) {
    const image = new Image();
    image.src = icon;
    image.setAttribute('alt', alt);
    image.setAttribute('width', size);
    image.setAttribute('height', size);
    
    if(classes) { image.setAttribute('class', classes); }
    return image;
}

function renderCheckBox(listIndex) {
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

    //When Checked, delete the item
    checkBox.addEventListener('change', () => {
        if(checkBox.checked) {
            const tableRow = checkBox.parentNode.parentNode.parentNode;

            //Perhaps animate the deletion -- highlight the row and fade it out or something?
            console.log("Removing: " + tableRow.childNodes[1].innerText);
            tableRow.parentNode.removeChild(tableRow);
        }
    })

    checkContainer.append(checkBox);
    return checkContainer;
}