// Module to build UI components with applicable Bootstrap classes
import exclamIcon from './assets/exclamation-lg.svg';
import alarmIcon from './assets/alarm.svg';
import chevronExpand from './assets/chevron-expand.svg';
import chevronDoubleUp from './assets/chevron-double-up.svg';
import chevronDoubleDown from './assets/chevron-double-down.svg';
import plus from './assets/plus.svg';

import * as storage from "./listController";
import { Todo } from './todoModel';

// ***MAIN TABLE RENDER FUNCTION***
export function renderList(todoList) {
    const listContainer = document.createElement('div');
    listContainer.setAttribute('class', 'listContainer');

    const table = renderTableHeader();
    const body = renderTableBody(todoList);

    table.appendChild(body);
    listContainer.appendChild(table);
    //console.log("Table with " + table.rows.length + " rows added to DOM");
    
    return listContainer;
}
// ***TABLE ROW RENDERING/MANIPULATION FUNCTIONS ***

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
        const newEntryIcon = renderIcon(plus, 25, 'Plus Icon', 'ms-4 newEntryIcon clickableIcon');
        const newEntryKey = renderRowElement(newEntryIcon, 'th', 'col');
        // Need to open a 'new entry' modal, using next available index for a todo
        newEntryIcon.classList.add('clickable');
        newEntryIcon.setAttribute('data-bs-toggle', 'modal');
        newEntryIcon.setAttribute('data-bs-target', '#staticBackdropNew'); 
        document.body.appendChild(renderDetailModal('New To-Do', 'New'));

        const itemKey = renderRowElement(document.createTextNode('To-Do'), 'th', 'col');
        let sortIcon = renderIcon(chevronExpand, 20, 'unsorted', 'me-1 sortIcon clickable clickableIcon');
        sortIcon.addEventListener('click', () => {
            sortTable(table, sortIcon, 1);
        })
        itemKey.prepend(sortIcon);
        itemKey.classList.add('align-middle');
        itemKey.setAttribute('id', 'entry-title');
        const dueDateKey = renderRowElement(document.createTextNode('Due'), 'th', 'col');
        let dueDateIcon = renderIcon(chevronExpand, 20, 'unsorted', 'me-1 sortIcon clickable clickableIcon');
        dueDateIcon.addEventListener('click', () => {
            sortTable(table, dueDateIcon, 2);
        });
        dueDateKey.prepend(dueDateIcon);
        dueDateKey.classList.add('align-middle');
        dueDateKey.setAttribute('id', 'entry-due');
        const impKey = renderRowElement(document.createTextNode('Priority'), 'th', 'col');
        impKey.classList.add('align-middle');
        thRow.append(newEntryKey, itemKey, dueDateKey, impKey);

        return table;
}

function sortTable(table, icon, rowIndex) {

    //rowIndex relates to which column we are sorting on
    //currently, only valid indices are 1, 2 (title, dueDate)
    var rows, swapping, i, x, y, shouldSwap, ascending, swapCount = 0;

    const sortState = icon.getAttribute('sortState');
    if(sortState == 'unsorted' || sortState == 'descending') { ascending = true; }
    else if(sortState == 'ascending') { ascending = false; }
    // Note: If invalid entry passed, ascending will be undefined (false for eval purposes)
    swapping = true;

    while(swapping) {
        //Start by saying no swapping is done
        swapping = false;
        rows = table.rows;

        //Loop through all table rows, comparing for shouldSwap
        //except first row, which is header
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying we shouldn't swap (default assumption)
            shouldSwap = false;
            //Compare two adjacent elements
            x = rows[i].getElementsByTagName('td')[rowIndex];
            y = rows[i+1].getElementsByTagName('td')[rowIndex];

            //Evaluate on ascend/descend
            if (ascending) {
                if(x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
                    //should swap, so mark and break loop
                    shouldSwap = true;
                    break;
                }
            }
            else { //descending sort
                if(x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
                    //should swap, so mark and break
                    shouldSwap = true;
                    break;
                }
            }
        }

        if(shouldSwap) {
            //If swap marked, make it happen then add to the swap count
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            swapping = true; //ensure the while loop continues
            swapCount++;
        }
        else {
            //If we made it thru the loop on ascending and swapped nothing
            //it was already sorted, so we want to sort descending
            if(swapCount == 0 && ascending == true) {
                ascending = false;
                swapping = true; //run loop again
            } 
        }
    }

    //Reset any other sort icons from previously sorted states
    var sortIcons = rows[0].querySelectorAll('.sortIcon');
    sortIcons.forEach(image => {
        image.setAttribute('src', chevronExpand);
        image.setAttribute('sortState', 'unsorted');
        image.setAttribute('class', 'me-1 sortIcon clickableIcon');
    });

    // Now change icon and sortState to reflect how we sorted
    var domIcon = rows[0].getElementsByTagName('th')[rowIndex].firstChild;
    if(ascending == true) { //do we have this backwards?
        domIcon.setAttribute('src', chevronDoubleUp);
        domIcon.setAttribute('sortState', 'ascending');
        domIcon.setAttribute('class', 'me-1 pb-1 sortIcon clickableIcon');
    }
    else if (ascending == false) {
        domIcon.setAttribute('src', chevronDoubleDown);
        domIcon.setAttribute('sortState', 'descending');
        domIcon.setAttribute('class', 'me-1 pt-1 sortIcon clickableIcon');
    }

}

function renderTableBody(todoList) {
    //Create Table Body, add list elements to it, and link in DOM
    const tBody = document.createElement('tbody');
    tBody.setAttribute('class', 'table-group-divider');
    
    //Add all entries from list in order
    for(let i = 0; i < todoList.length; i++) {
        tBody.appendChild(renderTableRow(todoList[i], i));
    }

    return tBody;
}

function renderTableRow(todo, listIndex) {
    const entryContainer = document.createElement('tr');
    const entryCheckBox = renderRowElement(renderCheckBox(listIndex), 'td');
    const entryTitle = renderRowElement(document.createTextNode(todo.title), 'td');
    const entryDue = renderRowElement(document.createTextNode(todo.dueDate), 'td');
    const exclam = renderIcon(exclamIcon, 30, 'Exclamation Mark');
    const alarm = renderIcon(alarmIcon, 25, 'Alarm Clock');

    //if not urgent/important, make the relevant icon invisible
    if(!todo.priority) {exclam.classList.add('invisible');}
    if(!todo.urgent) {alarm.classList.add('invisible');}

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
    document.body.appendChild(renderDetailModal(todo.title, listIndex));

    return entryContainer;
}

// ***TABLE ELEMENT RENDERING FUNCTIONS***

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
    image.setAttribute('sortState', alt);
    image.setAttribute('width', size);
    image.setAttribute('height', size);
    
    if(classes) { image.setAttribute('class', classes); }
    return image;
}

function renderCheckBox(listIndex) {
    const checkContainer = document.createElement('div');
    checkContainer.setAttribute('class', 'form-check');
    
    const checkBox = document.createElement('input');
    checkBox.setAttribute('class', 'form-check-input ms-1 me-3 clickable');
    checkBox.setAttribute('type', 'checkBox');
    checkBox.setAttribute('value', '');

    const id = 'checkbox-' + listIndex;
    checkBox.setAttribute('id', id);
    checkBox.setAttribute('data-index', listIndex);

    //When Checked, delete the item
    //Note, we will likely need to move this to controller/index -- some kind of refactoring
    checkBox.addEventListener('change', () => {
        if(checkBox.checked) {
            const tableRow = checkBox.parentNode.parentNode.parentNode;

            //Perhaps animate the deletion -- highlight the row and fade it out or something?
            deleteTableRow(tableRow);
            storage.deleteTodo(listIndex);
        }
    })

    checkContainer.append(checkBox);
    return checkContainer;
}

function deleteTableRow(tableRow) {
    const entry = tableRow.childNodes[1].innerText;
    tableRow.parentNode.removeChild(tableRow);
}

function deleteAllTableRows(tableBody) {
    while(tableBody.firstChild) {
        //tableBody.removeChild(tableBody.lastChild);
        deleteTableRow(tableBody.lastChild);
    }
}

// ***ENTRY/EDIT MODALS FUNCTIONS***

function renderInputAndLabel(inputId, inputType, labelText, prefilled='') {
    const container = document.createElement('div');
    container.setAttribute('class', 'mb-3');
    
    const label = document.createElement('label');
    label.setAttribute('class', 'form-label');
    label.setAttribute('for', inputId);
    label.innerText = labelText;
    let input = document.createElement('input');
    
    //override tag type to textarea if we have a tetarea
    if(inputType == 'textarea') {
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
        input.checked = prefilled;
    }

    input.defaultValue = prefilled;
    container.append(label, input);

    return container;
}

function renderDetailModal(title, index) {
    var entry = Todo.fromJSON(storage.readTodo(index));
    if (!entry) {
        //New entry form
        entry = new Todo('test', ''); //set name and description as blank strings
    }
    
    const details = document.createElement('div');
    details.setAttribute('class', 'modal fade');
    details.setAttribute('id', 'staticBackdrop' + index);
    details.setAttribute('data-bs-backdrop', 'static');
    details.setAttribute('data-bs-keyboard', 'false');
    details.setAttribute('tabindex', '-1');
    details.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.setAttribute('class', 'modal-dialog');

    const content = document.createElement('div');
    content.setAttribute('class', 'modal-content');

    const form = document.createElement('form');
    form.setAttribute('name', 'modal-form-' + index);
    form.setAttribute('method', 'POST');
    form.setAttribute('data-index', index);
    const name = renderInputAndLabel('entryName', 'textfield', 'Name', entry.title);
    const description = renderInputAndLabel('entryDescription', 'textarea', 'Details', entry.description);
    const priority = renderInputAndLabel('entryPriority' , 'checkbox', 'Important?', entry.priority);
    const urgent = renderInputAndLabel('entryUrgency', 'checkbox', 'Urgent?', entry.urgent);
    const dueDate = renderInputAndLabel('entryDueDate', 'date', 'Due', entry.formDate);

    const header = document.createElement('div');
    header.setAttribute('class', 'modal-header justify-content-center');
    const headerText = document.createElement('h1');
    headerText.setAttribute('class', 'modal-title fs-5');
    headerText.innerText = title;
    header.appendChild(headerText);
    
    const body = document.createElement('div');
    body.setAttribute('class', 'modal-body');
    const gridRow = document.createElement('div');
    gridRow.setAttribute('class', 'row');
    const gridCol = document.createElement('div');
    gridCol.setAttribute('class', 'col col-md-6');
    gridCol.append(dueDate, priority, urgent);
    gridRow.appendChild(gridCol);
    body.append(name, description, gridRow);
    

    const footer = document.createElement('div');
    footer.setAttribute('class', 'modal-footer');
    const saveButton = document.createElement('button');
    saveButton.setAttribute('type', 'submit');
    saveButton.setAttribute('class', 'btn btn-primary');
    saveButton.setAttribute('data-bs-dismiss', 'modal');
    saveButton.innerText = 'Save';
    const exitButton = document.createElement('button');
    exitButton.setAttribute('type', 'button');
    exitButton.setAttribute('class', 'btn btn-secondary');
    exitButton.setAttribute('data-bs-dismiss', 'modal');
    exitButton.innerText = 'Exit';
    footer.append(exitButton, saveButton);

    form.append(header, body, footer);
    content.appendChild(form);
    dialog.appendChild(content);
    details.appendChild(dialog);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        storage.submitChanges(form);
        const tableBody = document.querySelector('tbody');
        let index = form.getAttribute('data-index')
        
        if(isNaN(index)) {
            // add entry at end -- new item (need more detail if multiple tables)
            index = tableBody.childNodes.length;
            tableBody.appendChild(renderTableRow(storage.readTodo(index), index));
        }
        else {
            //update entry, remove old data row and insert new one in its place
            const oldRow = tableBody.childNodes[index];
            const newRow = renderTableRow(storage.readTodo(index), index);
            tableBody.insertBefore(newRow, oldRow);
            deleteTableRow(oldRow);
        }
    })

    return details;
}