# local2json v1.3.0

## listado de funciones:

 - Clear
 - CreateCollection
 - GetCollection
 - UpdateCollection
 - DeleteCollection
 - CollectionItems
 - ThisCollectionExist
 - Id
 - Insert
 - Get
 - GetById
 - Delete
 - Update
 - Trigger

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

### Clear
elimina completamente los datos incluyento las colecciones

    const storage = new local2json('mydatabase');
    storage.Clear();

### CreateCollection
crea fácilmente una nueva coleccion, primer parametro (obligatorio) nombre de la coleccion, 2do parametro (opcional, booleano) generar in ID automatico

    const storage = new local2json('mydatabase');
    storage.CreateCollection('user');

### ThisCollectionExist
verifica que la tabla especificada exista en la base de datos, retorna verdadero o falso

    const storage = new local2json('mydatabase');
    if(storage.ThisCollectionExist('user')){
        console.log('la coneccion [user] ya existe');
    }
    else{
        storage.CreateCollection('user');
        console.log('la coleccion [user] no existía pero se creo');
    }

### GetCollection
obtiene un objeto que contiene 2 atributos (index,items) items contiene un array con todos los registros de la coleccion especificada

    const storage = new local2json('mydatabase');
    const users = storage.GetCollection('user');

### UpdateCollection
actualiza todos los registros de la coleccion especificada, cuidado su uso incorrecto puede hacer que se eliminen los registros

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
    storage.UpdateCollection('user',newUsers);

### DeleteCollection
elimina una coleccion y todos los registros que contiene

    const storage = new local2json('mydatabase');
    storage.DeleteCollection('user');

### Insert
inserta un nuevo objeto en la coleccion especificada

    const storage = new local2json('mydatabase');
    const person = {
	    name:'Mark',
	    age:17,
	    phone:890043
    }
    storage.Insert('user',person);

### Id
genera un string con caracteres aleatorios, parametro opcional: cantidad minima de caracteres a generar

    const storage = new local2json('mydatabase');
    const newId = storage.Id(15); // genera un ID con 15 caracteres

### Get
obtiene los elementos que encajen con los parámetros de búsqueda

    const storage = new local2json('mydatabase');
    const parameter = 'name == mark';
    const items = storage.Get('user',parameter);
    
### GetById
    const storage = new local2json('mydatabase');
    const user = storage.GetById('user','abcd12345');

### Delete
elimina los elementos que encajen con los parámetros de búsqueda

	const storage = new local2json('mydatabase');
    const parameter = 'age >= 17';
    storage.Delete('user',parameter);

### Update
actualiza los elementos que encajen con los parámetros de búsqueda

	const storage = new local2json('mydatabase');
    const parameter = 'age != 15';
    storage.Update('user',parameter);

## Trigger
permite ejecutar una funcion despues que se realice un cambio en un elemento de la coleccion especificada: insertar(insert), eliminar(delete) o actualizar(update).

    const storage = new local2json('mydatabase');
    DB.Trigger('user','update',obj=>{
        console.log('Se actualizo un usuario 🔄');
    });

    const parameter = 'age != 15';
    storage.update('user',parameter);

## ejemplo completo 1

    const  DB  =  new  local2json('farm');
    
    // crear coleccion si esta no existe
    if(!DB.ThisCollectionExist('animal')){
        DB.CreateCollection('animal');
    }
    
      
    
    DB.Insert('animal',{name:'dog',color:'black'});
    DB.Insert('animal',{name:'cat',color:'white'});
    DB.Insert('animal',{name:'dog',color:'brown'});
    
      
    
    const  blackAnimals  =  DB.Get('animal','color == black');
    
    

## ejemplo completo 2
    const DB = new local2json('shop');
    
    DB.CreateCollection('client');
    
      
    
    DB.Insert('client',{name:'Jose López',sex:'M',age:23});
    DB.Insert('client',{name:'Tamara Gonzales',sex:'F',age:37});
    DB.Insert('client',{name:'Hilda Bayres',sex:'F',age:21});
    
      
    // obtendra una lista de todos los clientes que contengan la palabra Bayres
    const lastName = DB.Get('client','name %% Bayres');
    console.log(lastName);