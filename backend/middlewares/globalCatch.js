function globalCatch(err, req, res, next) {
    res.status(404).json({ message: "Caught in global catch" })
}

module.exports = globalCatch;