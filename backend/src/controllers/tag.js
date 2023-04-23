const model = require('../models/_tag');

const createTags = async (req, res) => {
    const answer = await model.create(req.body);
    if (answer.status === "OK") return res.status(201).json(answer);
    return res.status(500).json(answer);
};

const getTags = async (req, res) => {
    const answer = await model.get(req.query);
    if (answer.status === "OK") return res.status(200).json(answer);
    return res.status(500).json(answer);
}

module.exports = {
    createTags,
    getTags
}