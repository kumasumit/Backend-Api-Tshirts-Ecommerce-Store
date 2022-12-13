module.exports.home = (req, res)=> {
    res.status(200).json({
        sucess: true,
        message: "Hello from Api"
    })
}