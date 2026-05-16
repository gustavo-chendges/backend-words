const validateRequest = (schema) => (req, res, next)  => {
    console.log(req.body)
    const result = schema.safeParse(req.body)

    if(!result.success){
        console.log(result)

        return res.status(400).json({
            message: result.error.flatten().fieldErrors
        })
    }

    

    req.validatedData = result.data
    next()
}

module.exports = validateRequest
