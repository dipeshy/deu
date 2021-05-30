
const { NPMSCRIPT_START } = require('../lib/constants');
const { debug } = require('../lib/logger');
const { taskRunner, } = require('../lib/task-runner');

exports.runServiceTask = (service) => (task) => (services) => {
    const serviceDef = findByName(service)(services);
    const taskDef = findByName(task)(serviceDef.tasks);
    debug(serviceDef);
    debug(taskDef);
    taskRunner(NPMSCRIPT_START, serviceDef, taskDef);
};


const findByName = (_name) => (list) => {
    return list.find(({name}) => name === _name);
}
