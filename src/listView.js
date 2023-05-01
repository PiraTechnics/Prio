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
    entryContainer.classList.add('entryRow');

    //Add clickable functionality to Title, which brings up a description and editable forms in a modal
    entryTitle.classList.add('clickable');
    entryTitle.setAttribute('data-bs-toggle', 'modal');
    entryTitle.setAttribute('data-bs-target', '#staticBackdrop' + listIndex);
    entryContainer.appendChild(renderDetailModal(Todo, listIndex));

    return entryContainer;
}

function renderInputAndLabel(inputId, inputType, labelText) {
    const container = document.createElement('div');
    container.setAttribute('class', 'mb-3');
    
    const label = document.createElement('label');
    label.setAttribute('class', 'form-label');
    label.setAttribute('for', inputId);
    label.innerText = labelText;

    let input = document.createElement('input');
    //override tag to textarea if we have a tetarea
    if(inputType == 'textarea') {
        //input.parentNode.removeChild(input);
        input = document.createElement('textarea');
    }

    input.setAttribute('class', 'form-control');
    input.setAttribute('id', inputId);
    input.setAttribute('type', inputType);

    // Set different classes for checkboxes
    if(inputType == 'checkbox') {
        label.setAttribute('class', 'form-check-label px-1 ms-3' );
        input.setAttribute('class', 'form-check-input ps-2');
        container.classList.add('d-inline');
    }

    container.append(label, input);

    return container;
}

function renderDetailModal(entry, index) {
    const details = document.createElement('div');
    details.setAttribute('class', 'modal fade');
    details.setAttribute('id', 'staticBackdrop' + index);
    details.setAttribute('data-bs-backdrop', 'static');
    details.setAttribute('data-bs-keyboard', 'false');
    details.setAttribute('tabindex', '-1');
    //details.setAttribute('aria-labelledby', 'staticBackdropLabel');
    details.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.setAttribute('class', 'modal-dialog');

    const content = document.createElement('div');
    content.setAttribute('class', 'modal-content');

    const header = document.createElement('div');
    header.setAttribute('class', 'modal-header justify-content-center');
    const headerText = document.createElement('h1');
    headerText.setAttribute('class', 'modal-title fs-5');
    headerText.innerText = entry.title;
    header.appendChild(headerText);

    const body = document.createElement('div');
    body.setAttribute('class', 'modal-body');
    const form = document.createElement('form');
    const description = renderInputAndLabel('entryDescription', 'textarea', 'Details');
    const priority = renderInputAndLabel('entryPriority' , 'checkbox', 'Important?');
    const urgent = renderInputAndLabel('entryUrgency', 'checkbox', 'Urgent?');
    const dueDate = renderInputAndLabel('entryDueDate', 'date', 'Due');
    
    const gridRow = document.createElement('div');
    gridRow.setAttribute('class', 'row');
    const gridCol = document.createElement('div');
    gridCol.setAttribute('class', 'col col-md-6');
    gridCol.append(dueDate, priority, urgent);
    gridRow.appendChild(gridCol);
    
    form.append(description, gridRow);
    body.appendChild(form);

    const footer = document.createElement('div');
    footer.setAttribute('class', 'modal-footer');
    
    const saveButton = document.createElement('button');
    saveButton.setAttribute('class', 'btn btn-primary');
    saveButton.innerText = 'Save Changes';
    const exitButton = document.createElement('button');
    exitButton.setAttribute('class', 'btn btn-secondary');
    exitButton.setAttribute('data-bs-dismiss', 'modal');
    exitButton.innerText = 'Exit';

    footer.append(exitButton, saveButton);
    content.append(header, body, footer);
    dialog.appendChild(content);
    details.appendChild(dialog);

    return details;
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
    checkBox.setAttribute('value', '');

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