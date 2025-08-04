import { useNavigate, useParams } from "react-router";
import BusinessRegistration from "../business-registration/business-registration";
import Skeleton from "@mui/joy/Skeleton";
import { useEffect } from "react";
import { api_business_data } from "../utils/constants";
import { useState } from "react";
import { addToken } from "../utils/user-utils";

export default function EditBusinessDetails(){

    const { businessId } = useParams()
    const [businessData, setBusinessData] = useState(null)
    useEffect(() => {
        let url = new URL(`${process.env.REACT_APP_BACKEND_URL}${api_business_data}`)
        url.searchParams.set('businessId', businessId)
        fetch(url.toString())
            .then(data => data.json())
            .then(json => setBusinessData(json))
            .catch(err => console.error('error while fetching businessData, ', err))

    }, [businessId])

    const navigate = useNavigate()
    const handleSave = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_business_data}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addToken(businessData))
        })
        .then(result => {
            if(result.status === 200){
                alert('Updated Successfuly!')
                navigate('/')
            }
            else {
                alert("Business Data couldn't be updated. Please try again.")
            }
        })
        .catch(err => console.error(err))
    }

    return( businessData ? <BusinessRegistration businessData={businessData} setBusinessData={setBusinessData} onSave={handleSave}/> : <Skeleton/>)
}