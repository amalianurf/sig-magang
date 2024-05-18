const Sequelize = require('sequelize');
const IndonesiaGeoModel = require('../models').IndonesiaGeo;
const CompanyModel = require('../models').Company;
const OpportunityModel = require('../models').Opportunity;

exports.getAll = async (req, res) => {
    try {
        const companyCounts = await CompanyModel.findAll({
            attributes: ['city', [Sequelize.fn('COUNT', Sequelize.col('id')), 'company_count']],
            group: 'city'
        });

        const opportunityCounts = await OpportunityModel.findAll({
            include: [{
                model: CompanyModel,
                attributes: ['city']
            }],
            attributes: ['Company.city', [Sequelize.fn('COUNT', Sequelize.col('Opportunity.id')), 'opportunity_count']],
            group: ['Company.city', 'Company.id']
        });

        const geomData = await IndonesiaGeoModel.findAll();

        const companyCountsMap = companyCounts.reduce((accumulator, value) => {
            accumulator[value.city] = parseInt(value.dataValues.company_count);
            return accumulator;
        }, {});

        const opportunityCountsMap = opportunityCounts.reduce((accumulator, value) => {
            if (accumulator[value.Company.city]) {
                accumulator[value.Company.city] = parseInt(accumulator[value.Company.city]) + parseInt(value.dataValues.opportunity_count);
            } else {
                accumulator[value.Company.city] = parseInt(value.dataValues.opportunity_count);
            }
            return accumulator;
        }, {});

        const geoJsonFeature = geomData.map(data => {
            if (companyCountsMap[data.city] > 0) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: data.geom.coordinates[0]
                    },
                    properties: {
                        city: data.city,
                        city_code: data.city_code,
                        shape_area: parseFloat(data.shape_area),
                        shape_leng: parseFloat(data.shape_leng),
                        companies: parseInt(companyCountsMap[data.city]),
                        opportunities: parseInt(opportunityCountsMap[data.city])
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