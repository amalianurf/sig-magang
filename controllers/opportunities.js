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
        if (req.body.length > 1) {
            const isValidData = req.body.every((data) => {
                return (
                    'name' in data &&
                    'activity_type' in data &&
                    'description' in data &&
                    'quota' in data &&
                    'duration' in data &&
                    'start_period' in data &&
                    'min_semester' in data &&
                    'salary' in data &&
                    'company_id' in data
                );
            });
    
            if (isValidData) {
                const reqData = req.body.map((data) => ({
                    ...data,
                    id: data.id || uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))

                const opportunity = await OpportunityModel.bulkCreate(reqData);
                if (!opportunity) {
                    return res.status(401).json({ message: 'Gagal menambahkan data' });
                }
            } else {
                return res.status(401).json({ message: 'Struktur data tidak sesuai format' });
            }
        } else {
            const opportunity = await OpportunityModel.create({
                id: uuidv4(),
                ...req.body,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            if (!opportunity) {
                return res.status(401).json({ message: 'Gagal menambahkan data' });
            }
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
                ...req.body,
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