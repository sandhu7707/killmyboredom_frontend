import Skeleton from "@mui/joy/Skeleton"
import { useEffect, useState } from "react"
import { api_registered_businesses } from "../utils/constants"
import { addToken } from "../utils/user-utils"
import { useNavigate } from 'react-router'
import Typography from '@mui/joy/Typography'
import { MdAddCircleOutline } from "react-icons/md";
import "./registered-businesses.css"

export default function RegisteredBusinesses() {

    const [businesses, setBusinesses] = useState(null)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_registered_businesses}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addToken({}))
            })
            .then(data => {
                if (data.status === 200)
                    return data.json()
                else if (data.status === 404)
                    return []
            })
            .then(json => setBusinesses(json))
    }, [])

    const navigate = useNavigate()

    return (<div style={{ display: 'block', marginInline: 'auto', paddingBlock: '3vh', width: '90%' }}>{
        businesses ?
            <div style={{ marginBlockStart: '2vh', borderTop: 'solid 0.5px black', boxSizing: 'border-box' }}>
                {businesses && businesses.length > 0 ? businesses.map(it => <div className="business-item" style={{ textAlign: 'start' }}>
                    <Typography onClick={() => navigate(`/business-page/${it._id}`)} level={'h3'} className="business-item-content">{it.businessName}</Typography>
                </div>)
                    : <Typography sx={{paddingBlock: '3vh', borderBottom: 'solid 0.5px black'}}>You haven't registered any Businesses.</Typography>
                }
                <div className='business-item add-business-option' style={{ textAlign: 'start', color: '' }}>
                    <Typography onClick={() => navigate(`/business-registration`)} level={'h2'} >Register a Business <MdAddCircleOutline /></Typography>
                </div>
            </div>
            : <Skeleton />
    }</div>
    )

}