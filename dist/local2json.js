class local2json{
    /*  create By: Magdiel López Morales <lpmagdiel>
        versión: 1.1.3
    */
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
        const tableRegisters = this.tables.length;
        for (let i=0;i<tableRegisters;i++){
            if(this.tables[i].name == tableName) return false;
        }
        this.tables.push({name:tableName,data:[],index:this.tables.length});
        this.Save();
        return true;
    }
    GetTable(tableName){
        let tableOut ={
            items:[],
            index:0
        };
        const tableRegisters = this.tables.length;
        for (let i=0;i<tableRegisters;i++) {
            if (this.tables[i].name == tableName) {
                tableOut.items = this.tables[i].data;
                tableOut.index = i;
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
    InsertItem(tableName,item){
        const tableRegisters = this.tables.length;
        for (let i=0;i < tableRegisters;i++) {
            if (this.tables[i].name == tableName) {
                this.tables[i].data.push(item);
                this.Save();
                return true;
            }
        }
        return false;
    }
    ClearObject(obj){
        let obj_str = JSON.stringify(obj);
        let out = "";
        obj_str = obj_str.replace('{', '');
        obj_str = obj_str.replace('}', '');
        Array.from(obj_str).map(t=>{
            if(t!='"' && t!='\\'){
                out += t;
            }
        });
        return out;
    }
    IsValidQuestion(question,val1,val2){
        let valid = false;
        switch(question){
            case '==':
                valid = (val1 == val2);
                break;
            case '<':
                valid = (val1 < val2);
                break;
            case '<=':
                valid = (val1 <= val2);
                break;
            case '>':
                valid = (val1 > val2);
                break;
            case '>=':
                valid = (val1 >= val2);
                break;
            case '!=':
                valid = (val1 != val2);
                break;
        }
        return valid;
    }
    GetItem(tableName,searchParameter){
        const tablesSelected = this.GetTable(tableName);
        const tableRegisters = tablesSelected.items.length;
        let result           = [];
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<tableRegisters;i++){
            const tableString = this.ClearObject(tablesSelected.items[i]);
            const parameters  = tableString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    if(this.IsValidQuestion(question,val2,value)){
                        result.push(tablesSelected.items[i]);
                        x = parameters.length;
                    }
                }
            }
        }
        return result;
    }
    DeleteItem(tableName,searchParameter){
        const tablesSelected = this.GetTable(tableName);
        const tableRegisters = tablesSelected.items.length;
        let result           = false;
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<tableRegisters;i++){
            const tableString = this.ClearObject(tablesSelected.items[i]);
            const parameters  = tableString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    if(this.IsValidQuestion(question,val2,value)){
                        this.tables[tablesSelected.index].data.splice(tablesSelected[i],1);
                        this.Save();
                        return true;
                    }
                }
            }
        }
        return result;
    }
    UpdateItem(tableName,searchParameter,newValue){
        const tablesSelected = this.GetTable(tableName);
        const tableRegisters = tablesSelected.items.length;
        let result           = false;
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<tableRegisters;i++){
            const tableString = this.ClearObject(tablesSelected.items[i]);
            const parameters  = tableString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    if(this.IsValidQuestion(question,val2,value)){
                        this.tables[tablesSelected.index].data[i] = newValue;
                        this.Save();
                        return true;
                    }
                }
            }
        }
        return result;
    }
}