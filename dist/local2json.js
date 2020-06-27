class local2json{
    /*  create By: Magdiel López Morales <lpmagdiel>
        versión: 1.1.5
    */
    constructor(name){
        this.name   = name;
        this.tables = [];
        this.triggers = [];
        if(localStorage.getItem(name)){
            this.tables = JSON.parse(localStorage.getItem(name));
        }
    }
    // table control functions
    Save(){
        localStorage.setItem(this.name,JSON.stringify(this.tables));
    }
    createTable(tableName){
        const tableRegisters = this.tables.length;
        for (let i=0;i<tableRegisters;i++){
            if(this.tables[i].name == tableName) return false;
        }
        this.tables.push({name:tableName,data:[],index:this.tables.length});
        this.Save();
        return true;
    }
    getTable(tableName){
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
    existTable(tableName){
        let out = false;
        const tableRegisters = this.tables.length;
        for (let i=0;i<tableRegisters;i++) {
            if (this.tables[i].name == tableName) {
                out = true;
                break;
            }
        }
        return out;
    }
    updateTable(tableName,data){
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
    deleteTable(tableName){
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
    insert(tableName,item){
        const tableRegisters = this.tables.length;
        for (let i=0;i < tableRegisters;i++) {
            if (this.tables[i].name == tableName) {
                this.tables[i].data.push(item);
                this.Save();
                for(let t in this.triggers){
                    if(this.triggers[t].table == tableName && this.triggers[t].event == 'insert'){
                        this.triggers[t].fun();
                    }
                }
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
            case '===':
                valid = (val1 === val2);
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
            case '%%':
                valid = (val2.indexOf(val1) > -1);
                break;
        }
        return valid;
    }
    get(tableName,searchParameter){
        const tablesSelected = this.getTable(tableName);
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
    delete(tableName,searchParameter){
        const tablesSelected = this.getTable(tableName);
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
                        let oldData = this.tables[tablesSelected.index].data[i];
                        this.tables[tablesSelected.index].data.splice(tablesSelected[i],1);
                        this.Save();
                        for(let t in this.triggers){
                            if(this.triggers[t].table == tableName && this.triggers[t].event == 'delete'){
                                this.triggers[t].fun();
                            }
                        }
                        return true;
                    }
                }
            }
        }
        return result;
    }
    update(tableName,searchParameter,newValue){
        const tablesSelected = this.getTable(tableName);
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
                        for(let t in this.triggers){
                            if(this.triggers[t].table == tableName && this.triggers[t].event == 'update'){
                                this.triggers[t].fun();
                            }
                        }
                        return true;
                    }
                }
            }
        }
        return result;
    }
    trigger(tableName,event,fx){
        this.triggers.push({table:tableName,event:event,fun:fx});
    }
}