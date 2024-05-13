'use client'
import { useParams } from 'next/navigation'
import OpportunityDetail from '@component/components/opportunity/OpportunityDetail'

function page() {
    const { id } = useParams('id')

    return (
        <OpportunityDetail id={id} />
    )
}

export default page