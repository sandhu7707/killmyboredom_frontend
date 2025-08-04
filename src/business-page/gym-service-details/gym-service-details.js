import Heatmap from "../heatmap/heatmap"
import { weekDays } from "../../utils/constants" 
import FeeCards from "../fee-cards/fee-cards"
import dayjs from "dayjs"

export default function GymServiceDetails ({businessData: gymServiceData}){

    return(
        <>
            <TimeslotsHeatmap timeslots={gymServiceData.timeSlots}/>
            <FeeCards basicFee={gymServiceData.basicFee} addOns={gymServiceData.addOns}/>
        </>
    )
}

export function TimeslotsHeatmap({timeslots}){
let filledSlots = timeslots.reduce((prev, curr) => {
        let filledSlots = {...prev}
        curr.weekdays.forEach(element => {
            let timeSlots = curr.timeSlots.map(it => {
                it = {
                    start: it.start instanceof dayjs ? it.start : dayjs(it.start),
                    end: it.end instanceof dayjs ? it.end : dayjs(it.end)
                }
                return {
                    start: it.start.hour() + it.start.minute()/60,
                    end: it.end.hour() + it.end.minute()/60
                }
            })
        
            filledSlots[element] = timeSlots
        });
        return filledSlots
    }, {})

    const heatmapData = {
        yLabels: weekDays,
        xLabels: new Array(24).fill(0).map( (it,idx) => {
            if(idx < 12){
                return (idx) + 'am'
            }
            else if(idx > 12){
                return (idx-12) + 'pm'
            }
            else{
                return '' + idx+'  ';
            }
        }),
        filledSlots,
        emptyColor: 'rgba(0, 0, 0, 0.52)',
        fillColor: 'rgba(177, 177, 177, 1)',
        strokeColor: 'rgba(177, 177, 177, 1)'
    }

    return <div style={{marginBlockStart: '2vh'}}><Heatmap options={heatmapData}/></div>
    
}