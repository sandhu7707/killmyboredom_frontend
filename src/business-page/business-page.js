import Typography from "@mui/joy/Typography"
import "./business-page.css"
import { MdFitnessCenter, MdOutlineSports, MdEvent } from "react-icons/md"
import Link from '@mui/joy/Link'
import GymServiceDetails from "./gym-service-details/gym-service-details"
import CoachingServiceDetails from "./coaching-service-details/coaching-service-details"
import EventsDetails from "./events-details/events-details"
import IconButton from "@mui/material/IconButton";
import { MdEdit } from "react-icons/md";
import { useContext } from "react"
import { UserContext } from "../utils/user-utils"
import { useNavigate } from "react-router"

export default function BusinessPage({businessData}){
    const services = {
        'Gym': {icon: <MdFitnessCenter />, component: <GymServiceDetails businessData={businessData.gymService}/>}, 
        'Personal Training': {icon: <MdOutlineSports />, component: <CoachingServiceDetails coachingServiceData={businessData.coachingElements}/>}, 
        'Events': {icon: <MdEvent />, component: <EventsDetails eventsData={businessData.events}/>}
    }

    const {user} = useContext(UserContext)
    const navigate = useNavigate();

    return(
        <>
            {user && user.username === businessData.admin_user_id && <IconButton style={{display: 'block', marginInlineStart: 'auto'}} onClick={() => navigate(`/edit-business-details/${businessData._id}`)}><MdEdit /></IconButton>}
            <div className="business-page-header">
                <div>
                    <Typography className="business-title" id="business-page-title">{businessData.businessName}</Typography>
                </div>
                <Typography className='address-block' id="business-page-address-block"><Typography>{businessData.website && <Link variant="soft" href={businessData.website}>{businessData.website}</Link>}</Typography><Typography>{businessData.address}</Typography><Typography>{businessData.city}</Typography> <Typography>{businessData.state}</Typography></Typography>
            </div>

            <div className="business-page-services">
                {Object.keys(services).map(it => <>
                    {
                        businessData.businessType.includes(it) && 
                        <div style={{marginBlock: '5vh'}}>
                            <Typography level="h3" sx={{display: 'inline',textAlign: 'start', marginInlineStart: '1rem'}}>{it}{services[it].icon}</Typography>
                            {services[it].component}
                        </div>
                    }
                </>)}
            </div>

        </>
    )

}