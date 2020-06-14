module.exports = {
    register: (req, res, next) => {
        res.status(201).json(req.body);
    },

    login: (req, res, next) => {
        res.status(200).json({
            ...req.body
        });
    }
};