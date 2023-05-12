// Module to build UI components with applicable Bootstrap classes
import { renderTableHeader, renderTableBody } from "./table";
import { renderEntryEditModal } from "./tableElements";

export function renderList(todoList) {
    const listContainer = document.createElement('div');
    listContainer.setAttribute('class', 'listContainer');

    const table = renderTableHeader();
    const body = renderTableBody(todoList);

    table.appendChild(body);
    listContainer.append(table, renderEntryEditModal());
    
    return listContainer;
}