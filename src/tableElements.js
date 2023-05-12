//Helper Module to create elements of our Bootstrap-classed table rows
import * as bootstrap from 'bootstrap';
import * as storage from "./listController";
import exclamIcon from './assets/exclamation-lg.svg';
import alarmIcon from './assets/alarm.svg';
import { Todo } from "./todoModel";

export function renderTableRow(todo, listIndex) {
    const entryContainer = document.createElement('tr');
    const entryCheckBox = renderRowElement(renderCheckBox(listIndex), 'td');
    const entryTitle = renderRowElement(document.createTextNode(todo.title), 'td');
    const entryDue = renderRowElement(document.createTextNode(todo.dueDate), 'td');
    const exclam = renderIcon(exclamIcon, 30, 'Exclamation Mark');
    const alarm = renderIcon(alarmIcon, 25, 'Alarm Clock');

    //if not urgent/important, make the relevant icon invisible
    if (!todo.priority) { exclam.classList.add('invisible'); }
    if (!todo.urgent) { alarm.classList.add('invisible'); }

    const impWrapper = document.createElement('div');
    impWrapper.append(exclam, alarm);
    const entryImp = renderRowElement(impWrapper, 'td');

    entryContainer.append(entryCheckBox, entryTitle, entryDue, entryImp);
    entryContainer.classList.add('align-middle');
    entryContainer.classList.add('entryRow');

    //Add clickable functionality to Title, which brings up a description and editable forms in bootstrap static backdrop modal
    entryTitle.classList.add('clickable');
    entryTitle.setAttribute('data-bs-toggle', 'modal');
    entryTitle.setAttribute('data-bs-target', '#staticBackdrop');
    entryTitle.setAttribute('data-bs-index', listIndex);

    return entryContainer;
}

export function deleteTableRow(tableRow) {
    const entry = tableRow.childNodes[1].innerText;
    tableRow.parentNode.removeChild(tableRow);
}

export function renderRowElement(entry, type, scope) {
    const element = document.createElement(type);
    
    if(scope) {element.setAttribute('scope', scope)}
    element.appendChild(entry);

    return element;
}

export function renderIcon(icon, size, alt='icon', classes) {
    const image = new Image();
    image.src = icon;
    image.setAttribute('alt', alt);
    image.setAttribute('sortState', alt);
    image.setAttribute('width', size);
    image.setAttribute('height', size);
    
    if(classes) { image.setAttribute('class', classes); }
    return image;
}

export function renderEntryEditModal() {

    //create Bootstrap Modal Dom Components
    const details = document.createElement('div');
    details.setAttribute('class', 'modal fade');
    details.setAttribute('id', 'staticBackdrop');
    details.setAttribute('data-bs-backdrop', 'static');
    details.setAttribute('data-bs-keyboard', 'false');
    details.setAttribute('tabindex', '-1');
    details.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.setAttribute('class', 'modal-dialog');

    const content = document.createElement('div');
    content.setAttribute('class', 'modal-content');

    const form = document.createElement('form');
    form.setAttribute('name', 'modal-form');
    form.setAttribute('method', 'POST');

    //Render Form components
    let name = renderInputAndLabel('entryName', 'textfield', 'Name', '', true);
    let description = renderInputAndLabel('entryDescription', 'textarea', 'Details');
    let priority = renderInputAndLabel('entryPriority', 'checkbox', 'Important?');
    let urgent = renderInputAndLabel('entryUrgency', 'checkbox', 'Urgent?');
    let dueDate = renderInputAndLabel('entryDueDate', 'date', 'Due');
    

    const header = document.createElement('div');
    header.setAttribute('class', 'modal-header justify-content-center');
    const headerText = document.createElement('h1');
    headerText.setAttribute('class', 'modal-title fs-5');
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
    saveButton.innerText = 'Save';
    const exitButton = document.createElement('button');
    exitButton.setAttribute('type', 'button');
    exitButton.setAttribute('class', 'btn btn-secondary');
    exitButton.setAttribute('data-bs-dismiss', 'modal');
    exitButton.innerText = 'Exit';
    footer.append(exitButton, saveButton);

    //Putting the DOM elements together
    form.append(header, body, footer);
    content.appendChild(form);
    dialog.appendChild(content);
    details.appendChild(dialog);

    //Toggle on Modal event handling
    details.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const listIndex = button.getAttribute('data-bs-index');
        details.setAttribute('data-index', listIndex);

        if (listIndex != -1) {
            //Edit Entry form
            const entry = Todo.fromJSON(storage.readTodo(listIndex));
            if (!entry) {
                //Entry not found, throw error and exit
                console.log('ERROR: Entry at index: ' + listIndex + ' not found!');
                return false;
            }

            //Fill modal form inputs with entry data
            const form = details.querySelector('form');
            fillFormInputs(form, entry); 
        }
        else {
            //New Entry Form
            fillFormInputs(form, new Todo(''));
            headerText.innerText = 'New To-Do';
        }

    });

    //Submit button Form event handling
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const modal = bootstrap.Modal.getInstance(details);
        const inputs = form.querySelectorAll('input'); //NOTE: this does not include details (which is a textArea) consider updating this in the future for validation
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                return false; //We fail on even 1 failed validity check
            }
        });

        modal.toggle(); //toggle modal visibility off manually

        let index = document.getElementById('staticBackdrop').getAttribute('data-index');
        storage.submitChanges(form, index);
        const tableBody = document.querySelector('tbody');

        if (index == -1) {
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
    });

    return details;
}

function fillFormInputs(form, todo) {
    const titleInput = form.querySelector('.modal-title');
    const nameInput = form.querySelector('#entryName')
    const descInput = form.querySelector('#entryDescription');
    const dueInput = form.querySelector('#entryDueDate');
    const impInput = form.querySelector('#entryPriority');
    const urgInput = form.querySelector('#entryUrgency');

    titleInput.innerText = todo.title;
    nameInput.value = todo.title;
    descInput.value = todo.description;
    dueInput.value = todo.formDate;
    impInput.checked = todo.priority;
    urgInput.checked = todo.urgent;
}

function renderInputAndLabel(inputId, inputType, labelText, prefilled='', required=false) {
    const container = document.createElement('div');
    container.setAttribute('class', 'mb-3');

    const label = document.createElement('label');
    label.setAttribute('class', 'form-label');
    label.setAttribute('for', inputId);
    label.innerText = labelText;
    let input = document.createElement('input');

    //override tag type to textarea if we have a tetarea
    if (inputType == 'textarea') {
        input = document.createElement('textarea');
    }

    input.setAttribute('class', 'form-control');
    input.setAttribute('id', inputId);
    input.setAttribute('type', inputType);

    // Set different classes for checkboxes
    if (inputType == 'checkbox') {
        label.setAttribute('class', 'form-check-label px-1 ms-3');
        input.setAttribute('class', 'form-check-input ps-2');
        container.classList.add('d-inline');
        input.checked = prefilled;
    }

    input.required = required;
    input.defaultValue = prefilled;
    container.append(label, input);

    return container;
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
            //NOTE: perhaps refactor this to use a data-index?
            const tableRow = checkBox.parentNode.parentNode.parentNode;

            //Perhaps animate the deletion -- highlight the row and fade it out or something?
            deleteTableRow(tableRow);
            storage.deleteTodo(listIndex);
            
        }
    })

    checkContainer.append(checkBox);
    return checkContainer;
}