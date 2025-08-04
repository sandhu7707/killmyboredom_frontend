import Card from "@mui/joy/Card"
import dayjs from "dayjs"

export default function EventsDetails({eventsData}){

    return(<>
            {eventsData.map(it => {
                it.timeRange = {
                    start: it.timeRange.start instanceof dayjs ? it.timeRange.start: dayjs(it.timeRange.start),
                    end: it.timeRange.end instanceof dayjs ? it.timeRange.end: dayjs(it.timeRange.end)
                }
                return (<Card sx={{width: '80%', marginInline: 'auto', marginBlockStart: '3vh'}} key={it.name}>
                    <h1>{it.name}</h1>
                    <p>{it.description}</p>
                    <table>
                    <tr><td><h3>Time Range:</h3></td> <td><h3>{it.timeRange.start.hour()}:{it.timeRange.start.minute()} - {it.timeRange.end.hour()}:{it.timeRange.end.minute()}</h3></td></tr>
                    <tr><td><h3>Fee:</h3></td> <td><h3>{it.basicFee}</h3></td></tr>
                    {it.addOns.map(innerIt => <>
                        {innerIt.name && innerIt.fee && <tr><td><h3>{innerIt.name} Fee:</h3></td> <td><h3>{innerIt.fee}</h3></td></tr>}
                    </>)}
                    </table>
                    </Card>)
            })}
        </>
    )
}