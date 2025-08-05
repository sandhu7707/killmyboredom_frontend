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
        <div className="form-container">
            <div className="form-content">
                <MapArea
                    defaultPins={[formData.location]}
                    isPinMode={true}
                    handleLocationCallback={handleLocation}
                />
                <div className="stepper-buttons">
                    <Button className="generic-button" sx={{marginBlockStart: '3vh', color: 'white', marginInlineEnd: 'auto'}} onClick={decrementStep}>Previous</Button>
                    <Button className="generic-button" disabled={isNextDisabled} sx={{marginBlockStart: '3vh', color: 'white', marginInlineStart: 'auto'}} onClick={incrementStep}>Next</Button>
                </div>
            </div>
        </div>
    )
}