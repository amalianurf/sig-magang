const express = require('express');
const cors = require('cors');
const next = require('next');
require('dotenv').config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const middleware = require('./middleware/authorization');

const userController = require('./controllers/users');
const sectorController = require('./controllers/sectors');
const companyController = require('./controllers/companies');
const opportunityController = require('./controllers/opportunities');

app.prepare().then(() => {
    const server = express();
    const port = process.env.PORT;

    server.use(express.json())
    server.use(cors())

    server.post('/api/auth', userController.auth);

    // sector api
    server.get('/api/sectors', sectorController.getAll);
    server.get('/api/sector/:id', sectorController.getById);

    // company api
    server.get('/api/companies', companyController.getAll);
    server.get('/api/company/:id', companyController.getById);

    // opportunity api
    server.get('/api/opportunities', opportunityController.getAll);
    server.get('/api/opportunity/:id', opportunityController.getById);

    // kabupaten/kota api
    server.get('/api/cities', async (req, res) => {
        try {
            const response = await fetch('https://sipedas.pertanian.go.id/api/wilayah/list_wilayah?thn=2024&lvl=10&lv2=12');
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // admin only
    server.use(middleware.authMiddleware);

    server.post('/api/company', companyController.create);
    server.put('/api/company/:id', companyController.update);
    server.delete('/api/company/:id', companyController.delete);

    server.post('/api/sector', sectorController.create);
    server.put('/api/sector/:id', sectorController.update);
    server.delete('/api/sector/:id', sectorController.delete);

    server.post('/api/opportunity', opportunityController.create);
    server.put('/api/opportunity/:id', opportunityController.update);
    server.delete('/api/opportunity/:id', opportunityController.delete);

    server.get('*', (req, res) => {
        return handle(req, res);
    });
  
    server.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
});