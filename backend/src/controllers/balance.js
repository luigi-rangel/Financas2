const model = require('../models/_ticket');

const getBalance = async (req, res) => {
    const filter = {
        action: req.query.action,
        tags: req.body.tags,
        dateStart: new Date(req.query.dateStart || '2000-01-01'),
        dateEnd: new Date(req.query.dateEnd || '2100-12-31')
    };
    
    const answer = await model.getBalance(filter);
    if (answer.status === "OK") return res.status(200).json(answer);
    return res.status(500).json(answer);
};

const getSummary = async (req, res) => {
    const dateStart = new Date(req.params.month + '-01 00:00:00.000');

    const answer = await model.getSummary(dateStart);
    if (answer.status === "OK") return res.status(200).json(answer);
    return res.status(500).json(answer);
}

const getPanel = async (req, res) => {
    const answer = await model.getPanel(req.params.year);
    if (answer.status === "OK") return res.status(200).json(answer);
    return res.status(500).json(answer);
}

module.exports = {
    getBalance,
    getSummary,
    getPanel
};