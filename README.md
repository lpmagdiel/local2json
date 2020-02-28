# local2json
descargar aqui: [comprimido](#)

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

### NewTable
crea fácilmente una nueva tabla

    const storage = new local2json('mydatabase);
    storage.NewTable('user');

### GetTable
obtiene un array con todos los registros de la tabla especificada

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
