const responseHandler = require("../utils/responseHandler");

const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success){
            return responseHandler(res, 400, result.error.format());
        }
        req.body = result.data;
        next();
    };
};

module.exports = {validate};
