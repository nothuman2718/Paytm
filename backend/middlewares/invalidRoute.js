function invalidRoute(req, res, next) {
    res.status(404).json({ message: "Invalid Route" })
}

module.exports = invalidRoute;