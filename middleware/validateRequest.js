const validateRequest = (schema) => (req, res, next)  => {
    const result = schema.safeParse(req.body)

    if(!result.success){

        return res.status(400).json({
            message: result.error.flatten().fieldErrors
        })
    }

    req.validatedData = result.data
    next()
}

module.exports = validateRequest
