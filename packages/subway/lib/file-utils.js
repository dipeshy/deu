const {
    mkdirSync,
    existsSync,
} = require('fs');

const tryMakeDir = (dir) => {
    try {
        if (!existsSync(dir)) {
            mkdirSync(dir, {
                recursive: true,
                mode: '0755',
            });
        }
    } catch (error) {
        throw new Error(`Failed to create dir ${dir}: ${error.message}`);
    }
}


module.exports = {
    tryMakeDir,
};
