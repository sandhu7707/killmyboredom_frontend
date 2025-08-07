import { useEffect } from "react"
import { api_favorite_businesses } from "../utils/constants"
import { getToken } from "../utils/user-utils"
import Skeleton from "@mui/joy/Skeleton"
import { useState } from "react"
import Typography from '@mui/joy/Typography'
import { MdAddCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router"


export default function FavoritedBusinesses(){
    
    const [businesses, setBusinesses] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        let url = new URL(`${process.env.REACT_APP_BACKEND_URL}${api_favorite_businesses}`)
        url.searchParams.set('token', getToken())
        fetch(url)
        .then((data) => data.json())
        .then(json => setBusinesses(json))
        .catch(err => console.error(err))
        
    }, [])
    
    return(<div style={{display: 'block', marginInline: 'auto', paddingBlock: '3vh', width: '90%'}}>
        {businesses 
            ? <div style={{marginBlockStart: '2vh', borderTop: 'solid 0.5px black', boxSizing: 'border-box'}}>
                { businesses && businesses.length > 0 ? businesses.map(it => <div className="business-item" style={{textAlign: 'start'}}>
                    <Typography onClick={() => navigate(`/business-page/${it._id}`)} level={'h3'} className="business-item-content">{it.businessName}</Typography>
                </div>)
                : <Typography>You haven't registered any Businesses.</Typography>    
                }
                <div className='business-item add-business-option' style={{textAlign: 'start', color: ''}}>
                    <Typography onClick={() => navigate(`/business-registration`)} level={'h2'} >Register a Business <MdAddCircleOutline/></Typography>
                </div>
            </div>
            : <Skeleton/>
        }
    </div>)
}