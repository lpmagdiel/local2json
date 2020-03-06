class local2json{
    /*  create By: Magdiel López Morales <lpzcode.net>
        versión: 1.0.0
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
        this.tables.push({name:tableName,data:[]});
        this.Save();
        return true;
    }
    GetTable(tableName){
        let tableOut = [];
        const tableRegisters = this.tables.length;
        for (let i=0;i<tableRegisters;i++) {
            if (this.tables[i].name == tableName) {
                tableOut = this.tables[i].data;
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
    GetItem(tableName,searchParameter){
        const tablesSelected = this.GetTable(tableName);
        const tableRegisters = tablesSelected.length;
        let result           = [];
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<tableRegisters;i++){
            const tableString = this.ClearObject(tablesSelected[i]);
            const parameters = tableString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    switch (question) {
                        case '==':
                            if(val2 == value){
                                result.push(tablesSelected[i]);
                                x = parameters.length;
                            }
                            break;
                        case '<':
                            if(val2 < value){
                                result.push(tablesSelected[i]);
                                x = parameters.length;
                            }
                            break;
                        case '<=':
                            if(val2 <= value){
                                result.push(tablesSelected[i]);
                                x = parameters.length;
                            }
                            break;
                        case '>':
                            if(val2 > value){
                                result.push(tablesSelected[i]);
                                x = parameters.length;
                            }
                            break;
                        case '>=':
                            if(val2 >= value){
                                result.push(tablesSelected[i]);
                                x = parameters.length;
                            }
                            break;
                        case '!=':
                            if(val2 != value){
                                result.push(tablesSelected[i]);
                                x = parameters.length;
                            }
                            break;
                    }
                }
            }
        }
        return result;
    }
    DeleteItem(tableName,searchParameter){
        const tablesSelected = this.GetTable(tableName);
        const tableRegisters = tablesSelected.length;
        let result           = false;
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<tableRegisters;i++){
            const tableString = this.ClearObject(tablesSelected[i]);
            const parameters = tableString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    switch (question) {
                        case '==':
                            if(val2 == value){
                                this.tables.data.splice(tablesSelected[i],1);
                                this.Save();
                                return true;
                            }
                            break;
                        case '<':
                            if(val2 < value){
                                this.tables.data.splice(tablesSelected[i],1);
                                this.Save();
                                return true;
                            }
                            break;
                        case '<=':
                            if(val2 <= value){
                                this.tables.data.splice(tablesSelected[i],1);
                                this.Save();
                                return true;
                            }
                            break;
                        case '>':
                            if(val2 > value){
                                this.tables.data.splice(tablesSelected[i],1);
                                this.Save();
                                return true;
                            }
                            break;
                        case '>=':
                            if(val2 >= value){
                                this.tables.data.splice(tablesSelected[i],1);
                                this.Save();
                                return true;
                            }
                            break;
                        case '!=':
                            if(val2 != value){
                                this.tables.data.splice(tablesSelected[i],1);
                                this.Save();
                                return true;
                            }
                            break;
                    }
                }
            }
        }
        return result;
    }
    
    UpdateItem(tableName,searchParameter,itemValue){
        const val1     = searchParameter.split(' ',10)[0];
        const val2     = searchParameter.split(' ',10)[2];
        const question = searchParameter.split(' ',10)[1];
        for (let table=0;table < this.tables.length;table++) {
            if (this.tables[table].name == tableName) {
                let data = this.tables[table].data;
                let dataSize = data.length;
                for(let i=0;i<dataSize;i++){
                    let string = JSON.stringify(data[i]);
                    string = string.replace('{','');
                    string = string.replace('}','');
                    string = string.replace('"','');
                    let cad = string.split(',',5000);
                    for (let key=0;key < cad.length;key++) {
                        if(val1 == key.split(':')[0]){
                            switch (question) {
                                case '==':
                                    if(val2 == key.split(':')[1]){
                                        this.tables.data[table] = itemValue;
                                        this.Save();
                                        return true;
                                    }
                                    break;
                                case '<':
                                    if(val2 < key.split(':')[1]){
                                        this.tables.data[table] = itemValue;
                                        this.Save();
                                        return true;
                                    }
                                    break;
                                case '<=':
                                    if(val2 <= key.split(':')[1]){
                                        this.tables.data[table] = itemValue;
                                        this.Save();
                                        return true;
                                    }
                                    break;
                                case '>':
                                    if(val2 > key.split(':')[1]){
                                        this.tables.data[table] = itemValue;
                                        kthis.Save();
                                        return true;
                                    }
                                    break;
                                case '>=':
                                    if(val2 >= key.split(':')[1]){
                                        this.tables.data[table] = itemValue;
                                        this.Save();
                                        return true;
                                    }
                                    break;
                                case '!=':
                                    if(val2 != key.split(':')[1]){
                                        this.tables.data[table] = itemValue;
                                        this.Save();
                                        return true;
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
            break;
        }
        return false;
    }
}