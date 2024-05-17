const readline = require('readline');
const DataHandler = require('./classes/DataHandler')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.info('Welcome! Start by sending the commands that you want to execute. They can be one or many at once.');

const handler = new DataHandler();

rl.on('line', (line) => {
    const [action, ...rest] = line.split(' ');
    handler.handle(action, line, rest.join(' '))
});
