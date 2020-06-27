# local2json v1.1.5

## listado de funciones:

 - createTable
 - getTable
 - updateTable
 - deleteTable
 - existTable
 - insert
 - get
 - delete
 - update
 - trigger

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
| igualdad | === |
| menor que | < |
| menor o igual|<= |
|mayor que| >|
|mayor o igual| >= |
|diferente que| !=|
|contiene | %% |

### createTable
crea fácilmente una nueva tabla

    const storage = new local2json('mydatabase');
    storage.createTable('user');

### existTable
verifica que la tabla especificada exista en la base de datos, retorna verdadero o falso

    const storage = new local2json('mydatabase');
    if(storage.existTable('user')){
        console.log('la tabla [user] ya existe');
    }
    else{
        storage.createTable('user');
        console.log('la tabla [user] no existía pero se creo');
    }

### getTable
obtiene un objeto que contiene 2 atributos (index,items) items contiene un array con todos los registros de la tabla especificada

    const storage = new local2json('mydatabase');
    const users = storage.getTable('user');

### updateTable
actualiza todos los registros de la tabla especificada, cuidado su uso incorrecto puede hacer que se eliminen los registros

    const storage = new local2json('mydatabase');
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
    storage.updateTable('user',newUsers);

### deleteTable
elimina una tabla y todos los registros que contiene

    const storage = new local2json('mydatabase');
    storage.deleteTable('user');

### insert
inserta un nuevo objeto en la tabla especificada

    const storage = new local2json('mydatabase');
    const person = {
	    name:'Mark',
	    age:17,
	    phone:890043
    }
    storage.insert('user',person);


### get
obtiene los elementos que encajen con los parámetros de búsqueda

    const storage = new local2json('mydatabase');
    const parameter = 'name == mark';
    const items = storage.get('user',parameter);
    
### delete
elimina los elementos que encajen con los parámetros de búsqueda

	const storage = new local2json('mydatabase');
    const parameter = 'age >= 17';
    storage.delete('user',parameter);

### update
actualiza los elementos que encajen con los parámetros de búsqueda

	const storage = new local2json('mydatabase');
    const parameter = 'age != 15';
    storage.update('user',parameter);

## trigger
permite ejecutar una funcion despues que se realice un cambio en un elemento de la tabla especificada: insertar, eliminar o actualizar.

    const storage = new local2json('mydatabase');
    DB.trigger('user','update',obj=>{
        console.log('Se actualizo un usuario 🔄');
    });

    const parameter = 'age != 15';
    storage.update('user',parameter);

## ejemplo completo 1

    const  DB  =  new  local2json('farm');
    
    // crear tabla si esta no existe
    if(!DB.existTable('animal')){
        DB.createTable('animal');
    }
    
      
    
    DB.insert('animal',{name:'dog',color:'black'});
    DB.insert('animal',{name:'cat',color:'white'});
    DB.insert('animal',{name:'dog',color:'brown'});
    
      
    
    const  blackAnimals  =  DB.get('animal','color == black');
    
    

## ejemplo completo 2
    const DB = new local2json('shop');
    
    DB.createTable('client');
    
      
    
    DB.insert('client',{name:'Jose López',sex:'M',age:23});
    DB.insert('client',{name:'Tamara Gonzales',sex:'F',age:37});
    DB.insert('client',{name:'Hilda Bayres',sex:'F',age:21});
    
      
    // obtendra una lista de todos los clientes que contengan la palabra Bayres
    const lastName = DB.get('client','name %% Bayres');
    console.log(lastName);