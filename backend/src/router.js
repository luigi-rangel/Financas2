const express = require('express');
const router = express.Router();

const cors = require('cors');

router.use(cors());

const ticketController = require('./controllers/ticket');
const tagController = require('./controllers/tag');
const balanceController = require('./controllers/balance');

router.post('/ticket', ticketController.createTicket);
router.post('/tags', tagController.createTags);

router.get('/tickets', ticketController.getTickets);
router.get('/tags', tagController.getTags);
router.get('/balance', balanceController.getBalance);
router.get('/summary/:month', balanceController.getSummary);
router.get('/panel/:year', balanceController.getPanel);

router.put('/ticket/:id', ticketController.updateTicket);

router.delete('/ticket/:id', ticketController.deleteTicket);
router.delete('/tag/:id');

module.exports = router;