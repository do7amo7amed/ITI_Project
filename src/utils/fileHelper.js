const fs = require('fs');
const path = require('path');

// fs.promises.readFile(path.join(__dirname, '../data.json'))

// "./data/users.json"
// path.join(__dirname, '../data/users.json');

const readJSONFile = async (filename) => {
    const filePath = path.join(__dirname,"../data", filename);
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

const writeJSONFile = async (filename, data) => {
    const filePath = path.join(__dirname,"../data", filename);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
    readJSONFile,
    writeJSONFile
}

// JSON.stringify(data)
// [{"id" :1, "name": "hamada"}]


// JSON.stringify(data , null ,2)

// [
//     {
//         "id" :1, "name": "hamada"
//     },
//     {
//         "id" :2, "name": "ahmed"
//     }
// ]