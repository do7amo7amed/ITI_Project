const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success){
            return res.status(400).json({
                success: false,
                message: "validation failed",
                errors: result.error.issues
            });

        }
        req.body = result.data; // data after validaition and transform
        next();
    };
};

module.exports = {validate};
