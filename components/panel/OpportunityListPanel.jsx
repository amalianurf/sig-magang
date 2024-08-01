import React, { useEffect, useState } from 'react'
import OpportunityList from '../opportunity/OpportunityList'
import Button from '@component/components/Button'
import CloseIcon from '@mui/icons-material/Close'

function OpportunityListPanel(props) {
    const [opportunities, setOpportunities] = useState()

    useEffect(() => {
        const fetchOpportunities = async () => {
            await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/opportunities?city=${props.city}`).then(async (response) => {
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

        fetchOpportunities()
    }, [props.city])

    const handleClosePanel = () => {
        props.setCity(null)
    }

    return (
        <div className='relative w-full p-10 pb-20'>
            <OpportunityList isAdmin={props.isAdmin} opportunities={opportunities} />
            <Button type={'button'} onClick={handleClosePanel} name={<CloseIcon />} buttonStyle={'absolute top-5 right-5 flex items-center p-1.5 rounded-full text-grey hover:bg-grey-light/[.3]'} />
        </div>
    )
}

export default OpportunityListPanel