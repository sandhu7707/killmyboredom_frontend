import Typography from "@mui/joy/Typography";
import BusinessPage from "../../business-page/business-page";
import Button from "@mui/joy/Button";

export default function Finalize({registrationData, decrementStep, handleSave}){

    return (
    <>
        <Typography level="h5" variant="soft" padding={'1vh'} margin={'1vh'}>Please review the information submitted. Please edit the fields in previous steps to make changes, and submit the final version.</Typography>
        <div style={{border: 'solid 0.5px black'}}>
            <BusinessPage businessData={registrationData}></BusinessPage>
        </div>
        {<Button sx={{float: 'left', marginBlock: '2vh'}} onClick={decrementStep}>Previous</Button>} 
        {<Button sx={{float: 'right', marginBlock: '2vh'}} onClick={handleSave}>Save</Button>}
    </>
    )
}