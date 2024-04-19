import React from 'react'
import Link from 'next/link'

function Button(props) {
    return (
        <>
            {props.href != null ? 
                <button type={props.type} onClick={props.onClick} className={props.buttonStyle}>
                    <Link href={props.href}>{props.name}</Link>
                </button>
                :
                <button type={props.type} onClick={props.onClick} className={props.buttonStyle}>
                    {props.name}
                </button>
            }
        </>
    )
}

export default Button