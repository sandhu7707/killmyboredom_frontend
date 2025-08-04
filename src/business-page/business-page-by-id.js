import { useParams } from "react-router";
import BusinessPage from "./business-page";
import Skeleton from "@mui/joy/Skeleton";
import { useEffect } from "react";
import { api_business_data } from "../utils/constants";
import { useState } from "react";

export default function BusinessPageById(){
    const {businessId} = useParams()
    const [businessData, setBusinessData] = useState(null)
    
    useEffect(() => {
        let url = new URL(`${process.env.REACT_APP_BACKEND_URL}${api_business_data}`)
        url.searchParams.set('businessId', businessId)
        fetch(url.toString())
        .then(data => data.json())
        .then(json => setBusinessData(json))
        .catch(err => console.error('error while fetching businessData, ', err))

    }, [businessId])

    return <div style={{width: '90%', marginInline: 'auto', marginBlockStart: '3vh'}}> 
            {businessData 
            ? <BusinessPage businessData={businessData}/>
            : <Skeleton/>}
        </div>
}