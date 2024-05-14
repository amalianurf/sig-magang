import Image from 'next/image'
import OpportunityCard from '../opportunity/OpportunityCard'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

function CompanyDetail(props) {
    return (
        props.company ? (
            <div className='w-full flex flex-col gap-7'>
                <div className='flex flex-col gap-2.5'>
                    <div className='w-full flex items-center gap-4'>
                        <Image src={props.company.logo} width={65} height={65} alt='logo' className='w-fit aspect-square rounded-lg' priority />
                        <div className='w-full flex flex-col gap-2'>
                            <h3>{props.company.brand_name}</h3>
                            <div className='text-grey'>
                                {props.company.company_name && (
                                    <div>{props.company.company_name}</div>
                                )}
                                {props.sector && (
                                    <div>{props.sector}</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex items-start gap-0.5'>
                        <LocationOnOutlinedIcon fontSize='small' />
                        <div>{props.company.address ? props.company.address : (<em>Belum diketahui</em>)}</div>
                    </div>
                    {props.company.description && (
                        <div>{props.company.description}</div>
                    )}
                </div>
                {props.opportunities && (
                    <div className='flex flex-col gap-5'>
                        <h3>Lowongan Magang</h3>
                        {props.opportunities.length ? (
                            <div className='flex flex-col gap-2.5'>
                                {props.opportunities.map((opportunity, index) => {
                                    return (
                                        <OpportunityCard key={index} href={`${props.isAdmin ? '/admin/' : ''}opportunity/${opportunity.id}`} image={props.company.logo} name={opportunity.name} start_period={opportunity.start_period} activity_type={opportunity.activity_type} />
                                    )
                                })}
                            </div>
                        ) : (
                            <div>Belum ada lowongan</div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            <div className='p-3'>Loading...</div>
        )
    )
}

export default CompanyDetail