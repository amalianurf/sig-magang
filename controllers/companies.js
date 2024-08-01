const CompanyModel = require('../models').Company;
const IndonesiaGeoModel = require('../models').IndonesiaGeo;
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

exports.getAcceptedData = async (req, res) => {
    try {
        const companies = await CompanyModel.findAll({ where: { accepted: true }, order: [['updatedAt', 'DESC']] });
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
            return res.status(400).json({ message: 'Gagal mengambil data' });
        }

        res.status(200).json(company);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getFromAPI = async (req, res) => {
    try {
        const ids = req.body.ids;
        const companies = [];

        const cities = await IndonesiaGeoModel.findAll({ attributes: ['id', 'city'] });

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const getCityId = async (cityName) => {
            const city = cities.find(item => item.city === cityName);
            return city ? city.id : null;
        }

        const getCoordinates = async (address) => {
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.MAPS_KEY}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const location = data.results[0].geometry.location;
                return location;
            } catch (error) {
                console.error('Error:', error);
                return null;
            }
        }

        const fetchCompanies = async (id) => {
            try {
                const response = await fetch(`https://api.kampusmerdeka.kemdikbud.go.id/mitra/public/id/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const cityId = await getCityId(data.data.city)
                const coordinates = await getCoordinates(data.data.hq_address)
                const modifiedData = {
                    id: data.data.id,
                    brand_name: data.data.brand_name,
                    company_name: data.data.name,
                    description: data.data.description,
                    logo: data.data.logo,
                    address: data.data.hq_address,
                    location: coordinates ? {
                        type: 'Point',
                        coordinates: [
                            coordinates.lng,
                            coordinates.lat
                        ]
                    } : null,
                    sector_id: data.data.sector.id == '00000000-0000-0000-0000-000000000000' ? '291b3dc0-35f4-4071-bca0-06274b2be832' : data.data.sector.id,
                    sector_name: data.data.sector.name,
                    geo_id: cityId
                };

                return modifiedData;
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        };

        const fetchCompaniesRecursively = async (ids) => {
            if (ids.length === 0) {
                return res.status(200).json(companies);
            }

            const id = ids.shift();
            try {
                const company = await fetchCompanies(id);
                companies.push(company);
            } catch (error) {
                console.error(`Gagal melakukan fetching untuk company dengan id ${id}. Akan mencoba lagi setelah 6 menit.`);
                await sleep(360000);
                ids.unshift(id);
            }

            await fetchCompaniesRecursively(ids);
        };

        await fetchCompaniesRecursively([...ids]);
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
                    'brand_name' in data &&
                    'company_name' in data &&
                    'description' in data &&
                    'logo' in data &&
                    'address' in data &&
                    'location' in data &&
                    'sector_id' in data &&
                    'geo_id' in data
                );
            });
    
            if (isValidData) {
                const reqData = req.body.map((data) => ({
                    ...data,
                    id: data.id || uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }))
        
                try {
                    await CompanyModel.bulkCreate(reqData);
                } catch (error) {
                    console.error('Error:', error);
                    return res.status(400).json({ message: 'Gagal menambahkan data, harap cek kembali data' });
                }
            } else {
                return res.status(400).json({ message: 'Struktur data tidak sesuai format' });
            }
        } else {
            try {
                await CompanyModel.create({
                    ...req.body,
                    id: uuidv4(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            } catch (error) {
                console.error('Error:', error);
                return res.status(400).json({ message: 'Gagal menambahkan data' });
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
            return res.status(400).json({ message: 'Gagal mengubah data' });
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
            return res.status(400).json({ message: 'Gagal menghapus data' });
        }

        res.status(200).json({ message: 'Data perusahaan berhasil dihapus' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal menghapus data' });
    }
};