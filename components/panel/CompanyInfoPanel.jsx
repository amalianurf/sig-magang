import React, { useEffect, useState } from 'react'
import CompanyDetail from '@component/components/company/CompanyDetail'
import Button from '@component/components/Button'
import CloseIcon from '@mui/icons-material/Close'

function CompanyInfoPanel(props) {
    const [company, setCompany] = useState()
    const [opportunities, setOpportunities] = useState()
    const [companySector, setCompanySector] = useState()

    useEffect(() => {
        const company = props.companies.find((company) => {
            return company.id == props.companyId
        })

        setCompany(company)

        const fetchOpportunities = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities?company=${props.companyId}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                if (data) {
                    const filteredOpportunities = props.filteredOpportunityIds.map(id => {
                        const opportunity = data.find(item => item.id === id)
            
                        if (opportunity) {
                            return opportunity
                        } else {
                            return null
                        }
                    }).filter((opportunity) => opportunity != null)

                    setOpportunities(filteredOpportunities)
                }
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        const fetchCompanySector = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/sector/${company.sector_id}`).then(async (response) => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message)
                    })
                }
                return response.json()
            }).then((data) => {
                setCompanySector(data.name)
            }).catch((error) => {
                console.error('Error:', error)
            })
        }

        fetchOpportunities()
        fetchCompanySector()
    }, [props.companyId])

    const handleClosePanel = () => {
        props.setFilteredOpportunityIds(props.opportunityIds)
        props.setCompanyId(null)
    }

    return (
        <div className='relative w-full p-10 pb-20'>
            <CompanyDetail isAdmin={props.isAdmin} company={company} opportunities={opportunities} sector={companySector} />
            <Button type={'button'} onClick={handleClosePanel} name={<CloseIcon />} buttonStyle={'absolute top-5 right-5 flex items-center p-1.5 rounded-full text-grey hover:bg-grey-light/[.3]'} />
        </div>
    )
}

export default CompanyInfoPanel