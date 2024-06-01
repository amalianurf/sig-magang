const SectorModel = require('../models').Sector;
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
    try {
        const sectors = await SectorModel.findAll({ order: ['name'] });
        res.status(200).json(sectors);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getById = async (req, res) => {
    try {
        const sector = await SectorModel.findByPk(req.params.id);
        if (!sector) {
            return res.status(400).json({ message: 'Gagal mengambil data' });
        }

        res.status(200).json(sector);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.create = async (req, res) => {
    try {
        if (req.body.length > 1) {
            const isValidData = req.body.every((data) => {
                return 'name' in data;
            });
    
            if (isValidData) {
                const reqData = req.body.map((data) => ({
                    ...data,
                    id: data.id || uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
        
                const sector = await SectorModel.bulkCreate(reqData);
                if (!sector) {
                    return res.status(400).json({ message: 'Gagal menambahkan data, harap cek kembali data' });
                }
            } else {
                return res.status(400).json({ message: 'Struktur data tidak sesuai format' });
            }
        } else {    
            const sector = await SectorModel.create({
                ...req.body,
                id: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
            if (!sector) {
                return res.status(400).json({ message: 'Gagal menambahkan data' });
            }
        }

        res.status(201).json({ message: 'Data sektor berhasil ditambahkan' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menambahkan data' });
    }
};

exports.update = async (req, res) => {
    try {
        const dataUpdated = await SectorModel.update(
            {
                name: req.body.name,
                updatedAt: new Date()
            },
            {
                where: { id: req.params.id }
            }
        );
        if (dataUpdated === 0) {
            return res.status(400).json({ message: 'Gagal mengubah data' });
        }

        res.status(200).json({ message: 'Data sektor berhasil diubah' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengubah data' });
    }
};

exports.delete = async (req, res) => {
    try {
        const dataDeleted = await SectorModel.destroy({ where: { id: req.params.id } });
        if (dataDeleted === 0) {
            return res.status(400).json({ message: 'Gagal menghapus data' });
        }

        res.status(200).json({ message: 'Data sektor berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};