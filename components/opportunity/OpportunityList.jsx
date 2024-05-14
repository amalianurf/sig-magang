import OpportunityCard from './OpportunityCard'

function OpportunityList(props) {
    return (
        props.opportunities ? (
            <div className='flex flex-col gap-7'>
                <h3>Lowongan Magang</h3>
                {props.opportunities.length ? (
                    <div className='flex flex-col gap-2.5'>
                        {props.opportunities.map((opportunity, index) => {
                            return (
                                <OpportunityCard key={index} href={`opportunity/${opportunity.id}`} image={opportunity.Company.logo} name={opportunity.name} brand_name={opportunity.Company.brand_name} start_period={opportunity.start_period} />
                            )
                        })}
                    </div>
                ) : (
                    <div>Belum ada lowongan</div>
                )}
            </div>
        ) : (
            <div className='p-3'>Loading...</div>
        )
    )
}

export default OpportunityList