const fs = require('fs');

function deleteFile(filename, filePath) {
    return new Promise((resolve, reject) => {
        // 检查文件是否存在
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // 文件不存在
                reject(new Error('文件不存在'));
            } else {
                // 删除文件
                fs.unlink(filePath, (err) => {
                    if (err) {
                        // 删除失败
                        reject(new Error('删除文件失败'));
                    } else {
                        // 文件删除成功
                        resolve('文件删除成功');
                    }
                });
            }
        });
    });
}
module.exports = {
    deleteFile
}