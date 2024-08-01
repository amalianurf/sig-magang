const OpportunityModel = require('../models').Opportunity;
const CompanyModel = require('../models').Company;
const { v4: uuidv4 } = require('uuid');

exports.getAll = async (req, res) => {
    try {
        let opportunities = [];
        const query = req.query.company || null;

        if (query) {
            opportunities = await OpportunityModel.findAll({ where: { company_id: req.query.company } });
        } else {
            opportunities = await OpportunityModel.findAll({ order: [['updatedAt', 'DESC']] });
        }

        res.status(200).json(opportunities);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getAcceptedData = async (req, res) => {
    try {
        let opportunities = [];
        const query = req.query.company || req.query.sector || req.query.city || null;

        switch (query) {
            case req.query.company:
                opportunities = await OpportunityModel.findAll({ where: { company_id: req.query.company, accepted: true } });
                break;
        
            case req.query.sector:
                opportunities = await OpportunityModel.findAll({
                    include: [{
                        model: CompanyModel,
                        where: { sector_id: req.query.sector }
                    }],
                    where: { accepted: true }
                });
                break;

            case req.query.city:
                opportunities = await OpportunityModel.findAll({
                    include: [{
                        model: CompanyModel,
                        where: { geo_id: req.query.city }
                    }],
                    where: { accepted: true }
                });
                break;

            default:
                opportunities = await OpportunityModel.findAll({ where: { accepted: true }, order: [['updatedAt', 'DESC']] });
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
            return res.status(400).json({ message: 'Gagal mengambil data' });
        }

        res.status(200).json(opportunity);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getFromAPI = async (req, res) => {
    try {
        const response = await fetch('https://api.kampusmerdeka.kemdikbud.go.id/magang/browse/opportunities?opportunity_type=MANDIRI');
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }

        const data = await response.json();
        const modifiedData = data.data.map((item) => ({
            id: item.id,
            activity_type: item.activity_type,
            duration: item.months_duration,
            company_id: item.mitra_id
        }))

        res.status(200).json(modifiedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getDetailFromAPI = async (req, res) => {
    try {
        const ids = req.body.ids;
        const opportunityDetail = [];

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchOpportunityDetail = async (id) => {
            try {
                const response = await fetch(`https://api.kampusmerdeka.kemdikbud.go.id/magang/browse/opportunities/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const modifiedData = {
                    id: data.data.id,
                    name: data.data.name,
                    description: data.data.description,
                    start_period: data.data.start_period,
                    quota: data.data.quota,
                    min_semester: data.data.min_semester,
                    salary: data.data.benefits.show_salary ? data.data.benefits.salary : null
                };

                return modifiedData;
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        };

        const fetchOpportunitiesRecursively = async (ids) => {
            if (ids.length === 0) {
                return res.status(200).json(opportunityDetail);
            }

            const id = ids.shift();
            try {
                const detail = await fetchOpportunityDetail(id);
                opportunityDetail.push(detail);
            } catch (error) {
                console.error(`Gagal melakukan fetching untuk opportunity dengan id ${id}. Akan mencoba lagi setelah 6 menit.`);
                await sleep(360000);
                ids.unshift(id);
            }

            await fetchOpportunitiesRecursively(ids);
        };

        await fetchOpportunitiesRecursively([...ids]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data.' });
    }
}

exports.create = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
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
                }));

                try {
                    await OpportunityModel.bulkCreate(reqData);
                } catch (error) {
                    console.error('Error:', error);
                    return res.status(400).json({ message: 'Gagal menambahkan data, harap cek kembali data' });
                }
            } else {
                return res.status(400).json({ message: 'Struktur data tidak sesuai format' });
            }
        } else {
            try {
                await OpportunityModel.create({
                    id: uuidv4(),
                    ...req.body,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            } catch (error) {
                console.error('Error:', error);
                return res.status(400).json({ message: 'Gagal menambahkan data' });
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
            return res.status(400).json({ message: 'Gagal mengubah data' });
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
            return res.status(400).json({ message: 'Gagal menghapus data' });
        }

        res.status(200).json({ message: 'Data lowongan berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};