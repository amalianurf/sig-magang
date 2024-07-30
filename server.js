const express = require('express');
const cors = require('cors');
const next = require('next');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production ';
const app = next({ dev });
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

    server.get('/api/companies', companyController.getAll);
    server.get('/api/company/:id', companyController.getById);

    server.get('/api/opportunities', opportunityController.getAll);
    server.get('/api/opportunity/:id', opportunityController.getById);
    server.get('/api/active-opportunities', (req, res) => {
        fetch(`https://api.kampusmerdeka.kemdikbud.go.id/magang/browse/opportunities?opportunity_type=MANDIRI`).then(async (response) => {
            if (!response.ok) {
                return response.json().then(error => {
                    throw new Error(error.message)
                })
            }
            return response.json()
        }).then((data) => {
            res.status(200).json(data);
        }).catch((error) => {
            console.error('Error:', error);
            res.status(500).json({ message: error });
        });
    });

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