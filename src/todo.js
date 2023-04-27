export class Todo {
    constructor(title, description, dueDate, priority=false, urgent=false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.urgent = urgent;
    }

    get title() { return this._title; }
    set title(newTitle) { this._title = newTitle; }

    get description() { return this._description; }
    set description(newDesc) { this._description = newDesc; }

    get dueDate() { return this._dueDate; }
    set dueDate(newDate) { this._dueDate = newDate; }

    get priority() { return this._priority; }
    set priority(newPrio) { this._priority = newPrio; }

    get urgent() { return this._priority; }
    set urgent(newUrg) { this._urgent = newUrg; }
}