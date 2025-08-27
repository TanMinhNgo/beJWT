const apiController = {
    testApi: (req, res) => {
        return res.status(200).json({
            message: "Hello from test API"
        });
    }
}

module.exports = apiController;
