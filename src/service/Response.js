module.exports = {
    /**
     * @description This is a formate for success responce of api
     * @param data
     * @param code
     * @param message
     * @param res
     * @param extras
     * @returns {{data:*,meta:{message:*,code:*}}}
    */
    successResponseWithoutData(res, message, code = 1) {
        const response = {
            data: null,
            meta: {
                code,
                message
            }
        };
        return res.send(response);
    },

    successResponseData(res, data, code = 1, message, extras) {
        const response = {
            data,
            meta: {
                code,
                message
            }
        }
       //this function are replace the meta
        if (extras) {
            Object.keys(extras).forEach((key) => {
                if ({}.hasOwnProperty.call(extras, key)) {
                    response.meta[key] = extras[key];
                }
            });
        }
        return res.send(response);
    },

    errorResponseData(res, message, code = 400) {
        const response = {
            code,
            message
        }
        return res.status(code).send(response)
    },

    errorResponseWithoutData(res, message, code = 0) {
        const response = {
            data: null,
            meta: {
                code,
                message
            }
        }
        return res.send(response)
    },

    //check field validation data
    validationErrorResponseData(res, message, code = 400) {
        const response = {
            code,
            message
        };
        return res.status(code)
            .send(response);
    }
}