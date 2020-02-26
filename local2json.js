class local2json{
    // create By: Magdiel López Morales <lpzcode.net>
    constructor(name){
        this.name   = name;
        this.tables = [];
        if(localStorage.getItem(name)){
            this.tables = JSON.parse(localStorage.getItem(name));
        }
    }
    // table control functions
    Save(){
        localStorage.setItem(this.name,JSON.stringify(this.tables));
    }
    NewTable(tableName){
        this.tables.push({name:tableName,data:[]});
        this.Save();
        return true;
    }
    GetTable(tableName){
        let tableOut = [];
        for (const table in this.tables) {
            if (table.name == tableName) {
                tableOut = table;
                break;
            }
        }
        return tableOut;
    }
    UpdateTable(tableName,data){
        const tableRegisters = this.tables.length;
        for (let i=0;i < tableRegisters;i++) {
            if (this.tables[i].name == tableName) {
                this.tables[i].data = data;
                this.Save();
                return true;
            }
        }
        return false;
    }
    DeteleTable(tableName){
        const tableRegisters = this.tables.length;
        for (let i=0;i < tableRegisters;i++) {
            if (this.tables[i].name == tableName) {
                tables.splice(i, 1);
                this.Save();
                return true;
            }
        }
        return false;
    }
    // items control functions
    InsertItem(table,item){
        
    }
}