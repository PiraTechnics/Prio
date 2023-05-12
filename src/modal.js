//Helper Module to render Entry/Edit Modal for listView
//Using Bootstrap classes

import * as bootstrap from 'bootstrap';
import { renderTableRow, deleteTableRow } from "./table";
import * as storage from "./listController";
import { Todo } from "./todoModel";

function renderInputAndLabel(inputId, inputType, labelText, prefilled='', required=false) {
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

    input.required = required;
    input.defaultValue = prefilled;
    container.append(label, input);

    return container;
}

export function renderDetailModal(title, index) {
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
    const name = renderInputAndLabel('entryName', 'textfield', 'Name', entry.title, true);
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
    //saveButton.setAttribute('data-bs-dismiss', 'modal');
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

        const modal = bootstrap.Modal.getInstance(form.parentElement.parentElement.parentElement);
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                return false;
            }
        });

        modal.toggle();

        storage.submitChanges(form);
        const tableBody = document.querySelector('tbody');
        let index = form.getAttribute('data-index');
        
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