import Card from "@mui/joy/Card";
import FeeCards from "../fee-cards/fee-cards";
import { TimeslotsHeatmap } from "../gym-service-details/gym-service-details";
import { useState } from "react";
import Button from "@mui/joy/Button";

export default function CoachingServiceDetails({coachingServiceData}){
    return(<div style={{width: '100%'}}>{
        coachingServiceData.map(it => <CoachingCard it={it}/>)
    }</div>)

}

function CoachingCard({it}){

    const [collapsed, setCollapsed] = useState(true)

    return(
        <Card sx={{width: '45%', marginBlockStart: '2vh', marginInlineStart: '3.3%', boxSizing: 'border-box', display: 'inline-block'}}>
            <h3 style={{marginInline: 'auto'}}>{it.name}</h3>
            <p style={{marginInlineStart: '1rem'}}>{it.description}</p>
            <div style={{marginInline: 'auto', maxHeight: collapsed ? '0' : '200vh', transition: 'max-height 1s ease', overflow: 'hidden'}}>
                <TimeslotsHeatmap timeslots={it.timeSlots} /> 
                <FeeCards basicFee={it.basicFee} addOns={it.addOns}/>
            </div>
            <hr></hr>
            <div><Button onClick={() => {setCollapsed(collapsed => !collapsed)}} sx={{width: '100%'}}>{collapsed ? 'Expand' : 'Collapse'}</Button></div>
        </Card>
    )
}