const OpportunityModel = require('../models').Opportunity;
const CompanyModel = require('../models').Company;
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
    try {
        let opportunities = [];
        const query = req.query.company || req.query.sector || req.query.city || null;

        switch (query) {
            case req.query.company:
                opportunities = await OpportunityModel.findAll({ where: { company_id: req.query.company } });
                break;
        
            case req.query.sector:
                opportunities = await OpportunityModel.findAll({
                    include: [{
                        model: CompanyModel,
                        where: { sector_id: req.query.sector }
                    }],
                });
                break;

            case req.query.city:
                opportunities = await OpportunityModel.findAll({
                    include: [{
                        model: CompanyModel,
                        where: { city: req.query.city }
                    }],
                });
                break;

            default:
                opportunities = await OpportunityModel.findAll({ order: [['updatedAt', 'DESC']] });
                break;
        }
        res.status(200).json(opportunities);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getById = async (req, res) => {
    try {
        const opportunity = await OpportunityModel.findByPk(req.params.id);
        if (!opportunity) {
            return res.status(401).json({ message: 'Gagal mengambil data' });
        }

        res.status(200).json(opportunity);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.create = async (req, res) => {
    try {
        const opportunity = await OpportunityModel.create({
            id: uuidv4(),
            name: req.body.name,
            activity_type: req.body.activity_type,
            duration: req.body.duration,
            description: req.body.description,
            quota: req.body.quota,
            start_period: req.body.start_period,
            min_semester: req.body.min_semester,
            salary: req.body.salary,
            company_id: req.body.company_id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        if (!opportunity) {
            return res.status(401).json({ message: 'Gagal menambahkan data' });
        }

        res.status(201).json({ message: 'Data lowongan berhasil ditambahkan' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menambahkan data' });
    }
};

exports.update = async (req, res) => {
    try {
        const dataUpdated = await OpportunityModel.update(
            {
                name: req.body.name,
                activity_type: req.body.activity_type,
                duration: req.body.duration,
                description: req.body.description,
                quota: req.body.quota,
                start_period: req.body.start_period,
                min_semester: req.body.min_semester,
                salary: req.body.salary,
                company_id: req.body.company_id,
                updatedAt: new Date()
            },
            {
                where: { id: req.params.id }
            }
        );
        if (dataUpdated === 0) {
            return res.status(401).json({ message: 'Gagal mengubah data' });
        }

        res.status(200).json({ message: 'Data lowongan berhasil diubah' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengubah data' });
    }
};

exports.delete = async (req, res) => {
    try {
        const dataDeleted = await OpportunityModel.destroy({ where: { id: req.params.id } });
        if (dataDeleted === 0) {
            return res.status(401).json({ message: 'Gagal menghapus data' });
        }

        res.status(200).json({ message: 'Data lowongan berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};