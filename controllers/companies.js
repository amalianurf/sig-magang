const CompanyModel = require('../models').Company;
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
    try {
        const companies = await CompanyModel.findAll({ order: [['updatedAt', 'DESC']] });
        res.status(200).json(companies);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getById = async (req, res) => {
    try {
        const company = await CompanyModel.findByPk(req.params.id);
        if (!company) {
            return res.status(401).json({ message: 'Gagal mengambil data' });
        }

        res.status(200).json(company);
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
                    'brand_name' in data &&
                    'company_name' in data &&
                    'description' in data &&
                    'logo' in data &&
                    'address' in data &&
                    'city' in data &&
                    'location' in data &&
                    'sector_id' in data
                );
            });
    
            if (isValidData) {
                const reqData = req.body.map((data) => ({
                    ...data,
                    id: data.id || uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
        
                const company = await CompanyModel.bulkCreate(reqData);
                if (!company) {
                    return res.status(401).json({ message: 'Gagal menambahkan data' });
                }
            } else {
                return res.status(401).json({ message: 'Struktur data tidak sesuai format' });
            }
        } else {
            const company = await CompanyModel.create({
                ...req.body,
                id: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            if (!company) {
                return res.status(401).json({ message: 'Gagal menambahkan data' });
            }
        }

        res.status(201).json({ message: 'Data perusahaan berhasil ditambahkan' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menambahkan data' });
    }
};

exports.update = async (req, res) => {
    try {
        const dataUpdated = await CompanyModel.update(
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

        res.status(200).json({ message: 'Data perusahaan berhasil diubah' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengubah data' });
    }
};

exports.delete = async (req, res) => {
    try {
        const dataDeleted = await CompanyModel.destroy({ where: { id: req.params.id } });
        if (dataDeleted === 0) {
            return res.status(401).json({ message: 'Gagal menghapus data' });
        }

        res.status(200).json({ message: 'Data perusahaan berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};