//Helper Module to create elements of our Bootstrap-classed table rows
import * as bootstrap from 'bootstrap';
import * as storage from "./listController";
import { deleteTableRow } from "./table";

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

export function renderCheckBox(listIndex) {
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

            //delete paired modal
            const checkIndex = checkBox.getAttribute('data-index');
            const modal = document.getElementById('staticBackdrop' + checkIndex);
            console.log(modal);
            modal.remove(); //This works but we then create an issue with static indices on the DOM -- ****NOTE: we should refactor modal code to only create a single modal that autofills in info from whatever index checkbox it's pulling from (or on the '+' button it uses index=-1 for 'new entry' special behavior)****

            //Perhaps animate the deletion -- highlight the row and fade it out or something?
            deleteTableRow(tableRow);
            storage.deleteTodo(listIndex);
            
        }
    })

    checkContainer.append(checkBox);
    return checkContainer;
}