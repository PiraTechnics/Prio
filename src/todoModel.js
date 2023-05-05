import { format } from 'date-fns'

export class Todo {
    constructor(title, description, dueDate, priority=false, urgent=false) {
        this.title = title;
        this.description = description;
        
        if(dueDate) {
            this.dueDate = new Date(dueDate);
        }
        else {
            //Set Today's date as default (FOR NOW)
            this.dueDate = new Date();
        }
        
        this.priority = priority;
        this.urgent = urgent;
    }

    get title() { return this._title; }
    set title(newTitle) { this._title = newTitle; }

    get description() { return this._description; }
    set description(newDesc) { this._description = newDesc; }

    get dueDate() {
        const date = Date.parse(this._dueDate);
        return format(date, 'MM/dd/yy');
    }
    set dueDate(newDate) { this._dueDate = newDate; }

    get priority() { return this._priority; }
    set priority(newPrio) { this._priority = newPrio; }

    get urgent() { return this._priority; }
    set urgent(newUrg) { this._urgent = newUrg; }

    static fromJSON(json) {
        return Object.assign(new Todo(), json);
    }
}