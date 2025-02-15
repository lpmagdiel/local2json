class Local2Json {
    /*  create By: Magdiel López Morales <lpmagdiel>
        versión: 2.0.0 (Optimizado)
    */

    #operators = {
        '==': (a, b) => a == b,
        '===': (a, b) => a === b,
        '<': (a, b) => a < b,
        '<=': (a, b) => a <= b,
        '>': (a, b) => a > b,
        '>=': (a, b) => a >= b,
        '!=': (a, b) => a != b,
        '%%': (a, b) => b.includes(a),
        '$gt': (a, b) => a > b,
        '$lt': (a, b) => a < b,
        '$in': (a, b) => b.includes(a)
    };

    constructor(name) {
        this.name = name;
        this.collections = new Set();
        this.triggers = {};
        this.indexes = new Map();
        this.#loadCollections();
    }

    #loadCollections() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(`${this.name}_`)) {
                const collectionName = key.split('_')[1];
                this.collections.add(collectionName);
            }
        }
    }

    Id(MaxCharts = 24) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from(crypto.getRandomValues(new Uint8Array(MaxCharts)))
            .map(byte => chars[byte % chars.length])
            .join('');
    }

    #SaveCollection(collection) {
        const data = this.GetCollection(collection);
        localStorage.setItem(
            `${this.name}_${collection}`,
            JSON.stringify(data, null, 0)
        );
    }

    CreateCollection(collection, options = { index: [] }) {
        if (this.collections.has(collection)) return false;
        
        this.collections.add(collection);
        this.#SaveCollection(collection);
        
        options.index.forEach(field => 
            this.#createIndex(collection, field)
        );
        
        return true;
    }

    #createIndex(collection, field) {
        if (!this.indexes.has(collection)) {
            this.indexes.set(collection, new Map());
        }
        
        const index = this.indexes.get(collection);
        index.set(field, new Map());
        
        this.GetCollection(collection).forEach(item => {
            const value = item[field];
            if (value !== undefined) {
                if (!index.get(field).has(value)) {
                    index.get(field).set(value, new Set());
                }
                index.get(field).get(value).add(item.ID);
            }
        });
    }

    GetCollection(collection) {
        return JSON.parse(localStorage.getItem(`${this.name}_${collection}`)) || [];
    }

    Insert(collection, item) {
        if (!this.collections.has(collection)) return false;

        const data = this.GetCollection(collection);
        item.ID = this.Id();
        data.push(item);
        
        this.#updateIndexes(collection, item, 'add');
        localStorage.setItem(`${this.name}_${collection}`, JSON.stringify(data, null, 0));
        
        this.#fireTrigger(collection, 'insert');
        return item.ID;
    }

    #updateIndexes(collection, item, operation) {
        if (!this.indexes.has(collection)) return;

        const indexes = this.indexes.get(collection);
        indexes.forEach((indexMap, field) => {
            const value = item[field];
            if (value !== undefined) {
                if (operation === 'add') {
                    if (!indexMap.has(value)) {
                        indexMap.set(value, new Set());
                    }
                    indexMap.get(value).add(item.ID);
                } else {
                    if (indexMap.has(value)) {
                        indexMap.get(value).delete(item.ID);
                    }
                }
            }
        });
    }

    Query(collection, query = {}) {
        const data = this.GetCollection(collection);
        
        return data.filter(item => {
            return Object.entries(query).every(([field, condition]) => {
                if (typeof condition === 'object') {
                    return Object.entries(condition).every(([operator, value]) => 
                        this.#operators[operator](item[field], value)
                    );
                }
                return item[field] === condition;
            });
        });
    }

    GetById(collection, id) {
        return this.Query(collection, { ID: id })[0];
    }

    Update(collection, query, changes) {
        const items = this.Query(collection, query);
        const data = this.GetCollection(collection);
        
        items.forEach(item => {
            Object.assign(item, changes);
            this.#updateIndexes(collection, item, 'update');
        });
        
        localStorage.setItem(`${this.name}_${collection}`, JSON.stringify(data, null, 0));
        this.#fireTrigger(collection, 'update');
        return items.length;
    }

    Delete(collection, query) {
        const keepItems = this.GetCollection(collection).filter(item => {
            return !Object.entries(query).every(([field, condition]) => {
                if (typeof condition === 'object') {
                    return Object.entries(condition).every(([operator, value]) => 
                        this.#operators[operator](item[field], value)
                    );
                }
                return item[field] === condition;
            });
        });
        
        localStorage.setItem(`${this.name}_${collection}`, JSON.stringify(keepItems, null, 0));
        this.#fireTrigger(collection, 'delete');
        return this.GetCollection(collection).length - keepItems.length;
    }

    #fireTrigger(collection, event) {
        const key = `${collection}_${event}`;
        if (this.triggers[key]) {
            this.triggers[key]();
        }
    }

    Trigger(collection, event, handler) {
        this.triggers[`${collection}_${event}`] = handler;
    }

    Clear() {
        this.collections.forEach(collection => {
            localStorage.removeItem(`${this.name}_${collection}`);
        });
        this.collections.clear();
        this.indexes.clear();
        this.triggers = {};
    }
}
