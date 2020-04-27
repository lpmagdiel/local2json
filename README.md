# local2json

## listado de funciones:

 - NewTable
 - GetTable
 - UpdateTable
 - DeleteTable
 - InsertItem
 - GetItem
 - DeleteItem
 - UpdateItem

## como usar:
### inicializar
html script ==>

    <script src="local2json.js"></script>

código javascript

    const storage = new local2json('mydatabase');

   ### Parametros de busqueda
   ejemplo:
   
       [atribute_object] [operation] [value]


#### operaciones disponibles
|nombre| simbolo |
|--|--|
| igualdad | == |
| menor que | < |
| menor o igual|<=|
|mayor que|>|
|mayor o igual| >=|
|diferente que| !=|

### NewTable
crea fácilmente una nueva tabla

    const storage = new local2json('mydatabase);
    storage.NewTable('user');

### GetTable
obtiene un objeto que contiene 2 atributos (index,items) items contiene un array con todos los registros de la tabla especificada

    const storage = new local2json('mydatabase);
    const users = storage.GetTable('user');

### UpdateTable
actualiza todos los registros de la tabla especificada, cuidado su uso incorrecto puede hacer que se eliminen los registros

    const storage = new local2json('mydatabase);
    const newUsers = [
    {
	    name:'Juan',
	    age:17,
	    phone:123456
    },
    {
	    name:'Peter',
	    age:25,
	    phone:888888
    },
    {
	    name:'Mary',
	    age:23,
	    phone:654321
    }
    ];
    storage.UpdateTable('user',newUsers);

### DeleteTable
elimina una tabla y todos los registros que contiene

    const storage = new local2json('mydatabase);
    storage.DeleteTable('user');

### InsertItem
inserta un nuevo objeto en la tabla especificada

    const storage = new local2json('mydatabase);
    const person = {
	    name:'Mark',
	    age:17,
	    phone:890043
    }
    storage.InsertItem('user',person);


### GetItem
obtiene los elementos que encajen con los parámetros de búsqueda

    const storage = new local2json('mydatabase);
    const parameter = 'name == mark';
    const items = storage.GetItem('user',parameter);
    
### DeleteItem
elimina los elementos que encajen con los parámetros de búsqueda

	const storage = new local2json('mydatabase);
    const parameter = 'age >= 17';
    storage.DeleteItem('user',parameter);

### UpdateItem
actualiza los elementos que encajen con los parámetros de búsqueda

	const storage = new local2json('mydatabase);
    const parameter = 'age != 15';
    storage.UpdateItem('user',parameter);

## ejemplo completo

    const  DB  =  new  local2json('farm');
    
    DB.NewTable('animal');
    
      
    
    DB.InsertItem('animal',{name:'dog',color:'black'});
    DB.InsertItem('animal',{name:'cat',color:'white'});
    DB.InsertItem('animal',{name:'dog',color:'brown'});
    
      
    
    const  blackAnimals  =  DB.GetItem('animal','color == black');
    
    

