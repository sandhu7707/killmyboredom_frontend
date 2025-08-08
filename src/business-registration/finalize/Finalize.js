import Typography from "@mui/joy/Typography";
import BusinessPage from "../../business-page/business-page";
import Button from "@mui/joy/Button";

export default function Finalize({registrationData, decrementStep, handleSave}){

    return (
    <div className="form-container">
        <div className="form-content" style={{color: 'rgba(0,0,0,0)'}}>
            <Typography level="h5" variant="soft" padding={'1vh'} margin={'1vh'}>Please review the information submitted. Please edit the fields in previous steps to make changes, and submit the final version.</Typography>
            <div style={{border: 'solid 0.5px black'}}>
                <BusinessPage businessData={registrationData} isDraft={true}></BusinessPage>
            </div>
            <div className="stepper-buttons">
                <Button className="generic-button" sx={{marginBlockStart: '3vh', color: 'white', marginInlineEnd: 'auto'}} onClick={decrementStep}>Previous</Button>
                <Button className="generic-button" sx={{marginBlockStart: '3vh', color: 'white', marginInlineStart: 'auto'}}  onClick={handleSave}>Save</Button>
            </div>
        </div>
    </div>
    )
}