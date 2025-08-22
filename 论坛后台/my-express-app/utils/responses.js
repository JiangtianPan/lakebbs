/**
 * responses.js
 * 提供用于发送标准化HTTP响应的函数集合
 * 这些函数旨在统一处理API响应格式，提高代码复用性和一致性
 */
module.exports = {
    /**
     * 发送成功的HTTP响应
     * @param {Response} res - Express的响应对象
     * @param {number} [code=200] - HTTP状态码，默认200
     * @param {string} [message='操作成功'] - 返回的消息文本
     * @param {*} [data=null] - 需要返回的数据
     * @param {Object} [extra={}] - 额外的响应字段
     */
    respondSuccess: (res, code = 200, message = '操作成功', data = null, extra = {}) => {
        const responseObj = {
            code,
            msg: message,
            data,
            ...extra
        };
        res.status(code).json(responseObj);
    },

    /**
     * 发送错误的HTTP响应
     * @param {Response} res - Express的响应对象
     * @param {number} [code=400] - HTTP状态码，默认400
     * @param {string} [message='操作失败'] - 返回的消息文本
     * @param {Error} [error=null] - 错误对象
     * @param {Object} [extra={}] - 额外的响应字段
     */
    respondError: (res, code = 400, message = '操作失败', error = null, extra = {}) => {
        const responseObj = {
            code,
            msg: message,
            error: error ? error.message : null,
            ...extra
        };
        res.status(code).json(responseObj);
    },

    /**
     * 发送自定义HTTP响应
     * @param {Response} res - Express的响应对象
     * @param {number} code - HTTP状态码
     * @param {Object} body - 响应体
     */
    respondCustom: (res, code, body) => {
        res.status(code).json(body);
    },

    /**
     * 发送分页数据的HTTP响应
     * @param {Response} res - Express的响应对象
     * @param {number} [code=200] - HTTP状态码，默认200
     * @param {string} [message='查询成功'] - 返回的消息文本
     * @param {Array} data - 分页数据
     * @param {number} total - 总记录数
     * @param {number} page - 当前页码
     * @param {number} pageSize - 每页记录数
     */
    respondPagination: (res, code = 200, message = '查询成功', data, total, page, pageSize) => {
        const responseObj = {
            code,
            msg: message,
            data,
            pagination: {
                total,
                page,
                pageSize
            }
        };
        res.status(code).json(responseObj);
    }
};

/**
 * 使用方法：
 * 
 * 1. 成功响应：
 *    const { respondSuccess } = require('./utils/responses');
 *    respondSuccess(res, 200, '用户创建成功', { userId: 123 });
 * 
 * 2. 错误响应：
 *    const { respondError } = require('./utils/responses');
 *    respondError(res, 400, '用户名已存在', new Error('Duplicate username'));
 * 
 * 3. 自定义响应：
 *    const { respondCustom } = require('./utils/responses');
 *    respondCustom(res, 201, { status: 'created', id: 456 });
 * 
 * 4. 分页响应：
 *    const { respondPagination } = require('./utils/responses');
 *    respondPagination(res, 200, '查询成功', users, 100, 1, 10);
 * 
 * 注意：在使用这些函数时，确保已经正确导入并且传入了Express的响应对象(res)。
 */