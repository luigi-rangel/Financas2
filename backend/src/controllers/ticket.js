const model = require('../models/_ticket');

const createTicket = async (req, res) => {
    const ticket = {
        value: req.body.value, 
        action: req.body.action, 
        date: req.body.date, 
        repetitions: req.body.repetitions || 1
    };

    const tags = req.body.tags;

    const answer = await model.createTicket(ticket, tags);
    if (answer.status === "OK") return res.status(201).json(answer);
    return res.status(500).json(answer);
};

const getTickets = async (req, res) => {
    const filter = {
        dateStart: new Date(req.query.dateStart || '2000-01-01'),
        dateEnd: new Date(req.query.dateEnd || '2100-12-31'),
        action: req.query.action,
        name: req.query.name
    };

    const answer = await model.getTickets(filter);
    if (answer.status === "OK") return res.status(200).json(answer);
    return res.status(500).json(answer);
};

const deleteTicket = async (req, res) => {
    const answer = await model.deleteTicket(Number.parseInt(req.params.id));
    if (answer.status === "OK") return res.status(200).json(answer);
    return res.status(500).json(answer);
};

const updateTicket = async (req, res) => {
    const answer = await model.updateTicket(Number.parseInt(req.params.id), req.body);
    if (answer.status === "OK") return res.status(200).json(answer);
    return res.status(500).json(answer);
};

module.exports = {
    createTicket,
    getTickets,
    deleteTicket,
    updateTicket
}