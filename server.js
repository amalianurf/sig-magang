const express = require('express');
const next = require('next');
require('dotenv').config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const userController = require('./controllers/users');
const sectorController = require('./controllers/sectors');

app.prepare().then(() => {
    const server = express();
    const port = process.env.PORT;

    server.use(express.json())

    server.post('/api/auth', userController.auth);

    // sector api
    server.get('/api/sectors', sectorController.getAll);
    server.get('/api/sector/:id', sectorController.getById);
    server.post('/api/sector', sectorController.create);
    server.put('/api/sector/:id', sectorController.update);
    server.delete('/api/sector/:id', sectorController.delete);

    server.get('*', (req, res) => {
        return handle(req, res);
    });
  
    server.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
});