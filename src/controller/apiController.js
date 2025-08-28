import loginRegisterService from '../service/loginRegisterService';

const apiController = {
    testApi: (req, res) => {
        return res.status(200).json({
            message: "Hello from test API"
        });
    },

    handleRegister: async (req, res) => {
        try {
            const { email, password, username, gender, phone, address } = req.body;
            if (!email || !password || !username || !gender || !phone || !address) {
                return res.status(400).json({
                    message: "All fields are required"
                });
            }
            await loginRegisterService.createNewUser(email, password, username, gender, phone, address, res);

            return res.status(201).json({
                message: "User registered successfully"
            });
        } catch (err) {
            console.error("Error occurred during registration:", err);
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

module.exports = apiController;
