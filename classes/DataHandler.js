class DataHandler {
    constructor() {
        this.data = {};
    }

    createEntry(line, payload, existingData) {
        payload = payload.split('/');
        let currentPath = this.data;
        for (const key of payload) {
            if (!currentPath[key]) {
                if (existingData){
                    currentPath[key] = {...existingData};
                }
                else {
                    currentPath[key] = {}
                }
            }
            currentPath = currentPath[key];
        }

        // Avoid null console logs when doing MOVE operation
        if(line){
            console.info(line);
        }
    }

    listEntries(data = this.data, indentCount = 0) {
        const indent = ' '.repeat(indentCount)
        for(const key in data){
            console.info(indent + key)
            if(typeof data[key] === 'object'){
                this.listEntries(data[key], indentCount + 1)
            }
        }
    }

    moveEntry(line, payload) {
        const [sourcePath, destinationPath] = payload.split(' ');
        const sourceKeys = sourcePath.split('/');
        const destinationKeys = destinationPath.split('/');
    
        let source = this.data;
        let destination = this.data;
        let createPath;
        for(const key of sourceKeys){
            if(!source[key]){
                console.error(`Cannot move ${sourcePath} - ${destinationPath} does not exist`)
                return;
            }
            source = source[key]
            createPath = key
        }

        for(const key of destinationKeys){
            if(!destination[key]){
                console.error(`Cannot move ${sourcePath} - ${destinationPath} does not exist`)
                return
            }
            destination = destination[key]
        }

        this.deleteEntry(sourcePath)
        // Create path based on what will be moved
        this.createEntry(null, destinationPath + '/' + createPath, source)

        console.info(line);
    }
    

    deleteEntry(payload) {
        const keys = payload.split('/');
        let parentPath = this.data
        const keyToBeDeleted = keys.pop()
        for (const key of keys) {
            if (!parentPath[key]) {
                console.error(`Cannot delete ${payload} - ${key} does not exist and this`);
                return;
            }
            parentPath = parentPath[key];
        }

        if(!parentPath[keyToBeDeleted]){
            console.error(`Cannot delete ${payload} - ${keyToBeDeleted} does not exist this`);
            return;
        }
        delete parentPath[keyToBeDeleted]
    }

    static handlerMap = {
        CREATE: (instance, line, payload) => instance.createEntry(line, payload),
        LIST: (instance) => instance.listEntries(),
        MOVE: (instance, line, payload) => instance.moveEntry(line, payload),
        DELETE: (instance, line, payload) => instance.deleteEntry(payload)
    };

    handle(action, line, payload) {
        const handlerFunc = DataHandler.handlerMap[action];
        if (handlerFunc) {
            handlerFunc(this, line, payload);
        }
    }
}

module.exports = DataHandler