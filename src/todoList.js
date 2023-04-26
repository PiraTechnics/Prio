export class todoList {
    constructor(id, list=[]) {
        this.id = id;
        this.list = list;
    }

    get id() { return this._id; }
    set id(newId) { this._id = newId; }

    get size() { return this.list.length; }
    
    addEntry(todo) {
        this.list.push(todo);
    }

    deleteEntry(index) {
        if(index >= this.list.length || index < 0) {
            //out of bounds error
            throw new Error("Cannot delete at index " + index + ": entry does not exist");
        }
        //We only get here if not an error
        this.list.splice(index, 1);
    }

    getEntry(index) { 
        if(index >= this.list.length || index < 0) {
            //out of bounds error
            throw new Error("Cannot get at index " + index + ": entry does not exist");
        }
        return this.list[index];
    }

}