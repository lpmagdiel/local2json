class local2json{
    /*  create By: Magdiel López Morales <lpmagdiel>
        versión: 1.2.1
    */

   /**
    * Inicializar datos
    * @constructor
    * @param {string} name - Nombre de la base de datos
    */
    constructor(name){
        this.name           = name;
        this.collections    = [];
        this.triggers       = [];
        if(localStorage.getItem(name)){
            this.collections = JSON.parse(localStorage.getItem(name));
        }
    }
    /**
     * Genera una cantidad aleatoria de caracteres
     * @param {number} MaxCharts - Cantidad maxima de caracteres a generar por defecto 30
     * @returns {string}
     */
    Id(MaxCharts=30){
        const letters = Array.from('abcdefghijklmnopqrstuvwxyz0123456789');
        let out = '';
        while (out.length <= MaxCharts){
            out += letters[Math.floor(Math.random() * 36)] ;
        }
        return out;
    }
    // collections control functions
    Save(){
        localStorage.setItem(this.name,JSON.stringify(this.collections));
    }
    /**
     * Crear una nueva coleccion de datos
     * @param {string} Collection - Nombre de la coleccion
     * @returns {boolean}
     */
    CreateCollection(Collection,generateId=false){
        const CountCollection = this.collections.length;
        for (let i=0;i<CountCollection;i++){
            if(this.collections[i].name == Collection) return false;
        }
        this.collections.push({name:Collection,data:[],index:this.collections.length,generateId});
        this.Save();
        return true;
    }
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que se desea obtener
     * @returns {array} - Array de objetos dentro de esa coleccion
     */
    GetCollection(Collection){
        let CollectionOut ={
            items:[],
            index:0
        };
        const CountCollection = this.collections.length;
        for (let i=0;i<CountCollection;i++) {
            if (this.collections[i].name == Collection) {
                CollectionOut.items = this.collections[i].data;
                CollectionOut.index = i;
                break;
            }
        }
        return CollectionOut;
    }
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que se consultar
     * @returns {boolean}
     */
    ThisCollectionExist(Collection){
        let out = false;
        const CountCollection = this.collections.length;
        for (let i=0;i<CountCollection;i++) {
            if (this.collections[i].name == Collection) {
                out = true;
                break;
            }
        }
        return out;
    }
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que se consultar
     * @param {array} data - Nuevo array de objetos
     * @returns {boolean}
     */
    UpdateCollection(Collection,data=[]){
        const CountCollection = this.collections.length;
        for (let i=0;i < CountCollection;i++) {
            if (this.collections[i].name == Collection) {
                if(this.collections[i].generateId){
                    for(let x=0;x<data.length;x++){
                        data[x].ID = (data[x].ID != undefined)? data[x].ID : this.Id();
                    }
                }
                this.collections[i].data = data;
                this.Save();
                return true;
            }
        }
        return false;
    }
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que se desea eliminar
     * @returns {boolean}
     */
    DeleteCollection(Collection){
        const CountCollection = this.collections.length;
        for (let i=0;i < CountCollection;i++) {
            if (this.collections[i].name == Collection) {
                this.collections.splice(i, 1);
                this.Save();
                return true;
            }
        }
        return false;
    }
    // data control functions

    /**
     * 
     * @param {string} Collection - Nombre de la coleccion a ingresar nuevo registro
     * @param {object} item - Nuevo registro
     * @returns {boolean}
     */
    Insert(Collection,item){
        const CountCollection = this.collections.length;
        for (let i=0;i < CountCollection;i++) {
            if (this.collections[i].name == Collection) {
                if(this.collections[i].generateId) item.ID = this.Id();
                this.collections[i].data.push(item);
                this.Save();
                for(let t in this.triggers){
                    if(this.triggers[t].table == Collection && this.triggers[t].event == 'insert'){
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
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que se consultar
     * @param {string} searchParameter - consulta para buscar dentro de las colecciones
     * @returns {array}
     */
    Get(Collection,searchParameter){
        const SelectedCollection = this.GetCollection(Collection);
        const CountCollection = SelectedCollection.items.length;
        let result           = [];
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<CountCollection;i++){
            const CollectionString = this.ClearObject(SelectedCollection.items[i]);
            const parameters  = CollectionString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    if(this.IsValidQuestion(question,val2,value)){
                        result.push(SelectedCollection.items[i]);
                        x = parameters.length;
                    }
                }
            }
        }
        return result;
    }
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que se consultar
     * @param {string} searchParameter - consulta para buscar y eliminar registro dentro de las colecciones
     * @returns {boolean}
     */
    Delete(Collection,searchParameter){
        const SelectedCollection = this.GetCollection(Collection);
        const CountCollection = SelectedCollection.items.length;
        let result           = false;
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<CountCollection;i++){
            const CollectionString = this.ClearObject(SelectedCollection.items[i]);
            const parameters  = CollectionString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    if(this.IsValidQuestion(question,val2,value)){
                        this.collections[SelectedCollection.index].data.splice(SelectedCollection[i],1);
                        this.Save();
                        for(let t in this.triggers){
                            if(this.triggers[t].table == Collection && this.triggers[t].event == 'delete'){
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
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que se consultar
     * @param {string} searchParameter - consulta para buscar y actualizar registro dentro de las colecciones
     * @param {object} newValue - datos con los que reemplazar registro antiguo
     * @returns {boolean}
     */
    Update(Collection,searchParameter,newValue){
        const SelectedCollection = this.GetCollection(Collection);
        const CountCollection = SelectedCollection.items.length;
        let result           = false;
        const val1           = searchParameter.split(' ',10)[0];
        const val2           = searchParameter.split(' ',10)[2];
        const question       = searchParameter.split(' ',10)[1];
        for(let i=0;i<CountCollection;i++){
            const CollectionString = this.ClearObject(SelectedCollection.items[i]);
            const parameters  = CollectionString.split(',',500);
            for(let x=0;x<parameters.length;x++){
                if(parameters[x].split(':')[0] == val1){
                    const value = parameters[x].split(':')[1];
                    if(this.IsValidQuestion(question,val2,value)){
                        if(this.collections[SelectedCollection.index].generateId){
                            newValue.ID = this.collections[SelectedCollection.index].data[i].ID;
                        }
                        this.collections[SelectedCollection.index].data[i] = newValue;
                        this.Save();
                        for(let t in this.triggers){
                            if(this.triggers[t].table == Collection && this.triggers[t].event == 'update'){
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
    
    /**
     * 
     * @param {string} Collection - Nombre de la coleccion que asignar disparador
     * @param {string} event - nombre del evento a asignar
     * @param {Function} fx - funcion a ejecutar
     */
    Trigger(Collection,event,fx){
        this.triggers.push({table:Collection,event:event,fun:fx});
    }
    /**
     * Elimina todos los datos inclullendo las colecciones
     */
    Clear(){
        localStorage.clear();
        this.collections = [];
        this.triggers = [];
    }
}
