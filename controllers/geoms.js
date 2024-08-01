const Sequelize = require('sequelize');
const IndonesiaGeoModel = require('../models').IndonesiaGeo;
const CompanyModel = require('../models').Company;
const OpportunityModel = require('../models').Opportunity;

exports.getAll = async (req, res) => {
    try {
        const companyCounts = await CompanyModel.findAll({
            attributes: ['geo_id', [Sequelize.fn('COUNT', Sequelize.col('id')), 'company_count']],
            group: 'geo_id'
        });

        const opportunityCounts = await OpportunityModel.findAll({
            include: [{
                model: CompanyModel,
                attributes: ['geo_id']
            }],
            attributes: ['Company.geo_id', [Sequelize.fn('COUNT', Sequelize.col('Opportunity.id')), 'opportunity_count']],
            group: ['Company.geo_id', 'Company.id']
        });

        const geomData = await IndonesiaGeoModel.findAll();

        const companyCountsMap = companyCounts.reduce((accumulator, value) => {
            accumulator[value.geo_id] = parseInt(value.dataValues.company_count);
            return accumulator;
        }, {});

        const opportunityCountsMap = opportunityCounts.reduce((accumulator, value) => {
            if (accumulator[value.Company.geo_id]) {
                accumulator[value.Company.geo_id] = parseInt(accumulator[value.Company.geo_id]) + parseInt(value.dataValues.opportunity_count);
            } else {
                accumulator[value.Company.geo_id] = parseInt(value.dataValues.opportunity_count);
            }
            return accumulator;
        }, {});

        const geoJsonFeature = geomData.map(data => {
            if (companyCountsMap[data.id] > 0) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: data.geom.coordinates
                    },
                    properties: {
                        id: data.id,
                        city: data.city,
                        companies: parseInt(companyCountsMap[data.id]),
                        opportunities: parseInt(opportunityCountsMap[data.id])
                    }
                }
            } else {
                return null;
            }
        }).filter((data) => data !== null);

        const geoJsonData = {
            type: 'FeatureCollection',
            features: geoJsonFeature
        };

        res.status(200).json(geoJsonData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};

exports.getCity = async (req, res) => {
    try {
        const cities = await IndonesiaGeoModel.findAll({ attributes: ['id', 'city'] });
        res.status(200).json(cities);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data' });
    }
};