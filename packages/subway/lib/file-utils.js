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
            return `Home dir ${dir} not found. Created.`;
        }
        return `Home dir ${dir} exists`;
    } catch (error) {
        return `Failed to create dir ${dir}: ${error.message}`;
    }
}

module.exports = {
    tryMakeDir,
};
