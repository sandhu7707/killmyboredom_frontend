import MapArea from "../../map-area/map-area";
import Button from "@mui/joy/Button";
import { useEffect, useState } from "react";

export default function BusinessLocation({formData, setFormData, schema, incrementStep, decrementStep}) {
    
    const [isNextDisabled, setIsNextDisabled] = useState(true)

    useEffect(() => {
        schema.isValid(formData)
        .then((result) => setIsNextDisabled(!result))
    }, [formData])

    const handleLocation = async (location) => {
        setFormData(formData => {
            return {...formData, location: location}
        })
    }

    return (
        <>
            <MapArea
                defaultPins={[formData.location]}
                isPinMode={true}
                handleLocationCallback={handleLocation}
            />
            {<Button sx={{float: 'left', marginBlock: '2vh'}} onClick={decrementStep}>Previous</Button>}
            {<Button disabled={isNextDisabled} sx={{ float: 'right', marginBlock: '2vh' }} onClick={incrementStep}>Next</Button>}
        </>
    )
}