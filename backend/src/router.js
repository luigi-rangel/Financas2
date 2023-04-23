const express = require('express');
const router = express.Router();

const cors = require('cors');

router.use(cors());

const ticketController = require('./controllers/ticket');
const tagController = require('./controllers/tag');

router.post('/ticket', ticketController.createTicket);
router.post('/tags', tagController.createTags);

router.get('/tickets', ticketController.getTickets);
router.get('/tags', tagController.getTags);
router.get('/balance', ticketController.getBalance)

router.put('/ticket/:id', ticketController.updateTicket);

router.delete('/ticket/:id', ticketController.deleteTicket);
router.delete('/tag/:id');

module.exports = router;