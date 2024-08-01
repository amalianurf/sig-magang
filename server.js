const express = require('express');
const cors = require('cors');
const next = require('next');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: { distDir: '.next' } });
const handle = app.getRequestHandler();

const middleware = require('./middleware/authorization');

const userController = require('./controllers/users');
const sectorController = require('./controllers/sectors');
const companyController = require('./controllers/companies');
const opportunityController = require('./controllers/opportunities');
const geomController = require('./controllers/geoms');

app.prepare().then(() => {
    const server = express();
    const port = process.env.PORT;

    server.use(express.json());
    server.use(cors());
    server.use(cookieParser());

    // API ROUTES
    server.post('/api/auth', userController.auth);

    server.get('/api/sectors', sectorController.getAll);
    server.get('/api/sector/:id', sectorController.getById);

    server.get('/api/companies', companyController.getAcceptedData);
    server.get('/api/company/:id', companyController.getById);
    server.get('/api/companies/all', companyController.getAll);
    server.post('/api/companies/sync', companyController.getFromAPI);

    server.get('/api/opportunities', opportunityController.getAcceptedData);
    server.get('/api/opportunity/:id', opportunityController.getById);
    server.get('/api/opportunities/all', opportunityController.getAll);
    server.get('/api/opportunities/active', opportunityController.getFromAPI);
    server.post('/api/opportunities/sync', opportunityController.getDetailFromAPI);

    server.get('/api/geoms', geomController.getAll);
    server.get('/api/cities', geomController.getCity);

    server.get('/admin/*', (req, res) => {
        middleware.clientAuthMiddleware(req, res, () => {
            return handle(req, res);
        });
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    // ADMIN API ROUTES
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

    server.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
});