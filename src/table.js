// Helper Module for Rendering and Manipulating our Bootstrap-classed Table
import chevronExpand from './assets/chevron-expand.svg';
import chevronDoubleUp from './assets/chevron-double-up.svg';
import chevronDoubleDown from './assets/chevron-double-down.svg';
import plus from './assets/plus.svg';
import { renderTableRow, deleteTableRow, renderEntryEditModal, renderRowElement, renderIcon } from './tableElements';

export function renderTableHeader() {
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
    newEntryIcon.setAttribute('data-bs-target', '#staticBackdrop');
    newEntryIcon.setAttribute('data-bs-index', -1);
    //document.body.appendChild(renderDetailModal('New To-Do', 'New'));

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

export function renderTableBody(todoList) {
    //Create Table Body, add list elements to it, and link in DOM
    const tBody = document.createElement('tbody');
    tBody.setAttribute('class', 'table-group-divider');

    //Add all entries from list in order
    for (let i = 0; i < todoList.length; i++) {
        tBody.appendChild(renderTableRow(todoList[i], i));
    }

    return tBody;
}

export function clearTable(tableBody) {
    while (tableBody.firstChild) {
        deleteTableRow(tableBody.lastChild);
    }
}

export function sortTable(table, icon, rowIndex) {

    //rowIndex relates to which column we are sorting on
    //currently, only valid indices are 1, 2 (title, dueDate)
    var rows, swapping, i, x, y, shouldSwap, ascending, swapCount = 0;

    const sortState = icon.getAttribute('sortState');
    if (sortState == 'unsorted' || sortState == 'descending') { ascending = true; }
    else if (sortState == 'ascending') { ascending = false; }
    // Note: If invalid entry passed, ascending will be undefined (false for eval purposes)
    swapping = true;

    while (swapping) {
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
            y = rows[i + 1].getElementsByTagName('td')[rowIndex];

            //Evaluate on ascend/descend
            if (ascending) {
                if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
                    //should swap, so mark and break loop
                    shouldSwap = true;
                    break;
                }
            }
            else { //descending sort
                if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
                    //should swap, so mark and break
                    shouldSwap = true;
                    break;
                }
            }
        }

        if (shouldSwap) {
            //If swap marked, make it happen then add to the swap count
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            swapping = true; //ensure the while loop continues
            swapCount++;
        }
        else {
            //If we made it thru the loop on ascending and swapped nothing
            //it was already sorted, so we want to sort descending
            if (swapCount == 0 && ascending == true) {
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
    if (ascending == true) { //do we have this backwards?
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