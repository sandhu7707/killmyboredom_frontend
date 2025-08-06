import Typography from "@mui/joy/Typography"
import "./business-page.css"
import { MdFitnessCenter, MdOutlineSports, MdEvent, MdFavorite, MdSend, MdDelete } from "react-icons/md"
import Link from '@mui/joy/Link'
import GymServiceDetails from "./gym-service-details/gym-service-details"
import CoachingServiceDetails from "./coaching-service-details/coaching-service-details"
import EventsDetails from "./events-details/events-details"
import IconButton from "@mui/material/IconButton";
import { MdEdit } from "react-icons/md";
import { useContext, useEffect, useState } from "react"
import { addToken, setUserDetails, UserContext } from "../utils/user-utils"
import { createSearchParams, useNavigate } from "react-router"
import { Button, DialogTitle, Input, Modal, ModalDialog } from "@mui/joy"
import { api_favorite_business, api_reviews } from "../utils/constants"

export default function BusinessPage({businessData}){
    const [openModal, setOpenModal] = useState(false)
    const [review, setReview] = useState('')

    const postReview = () => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_reviews}`, {
            method: "POST",
            body: JSON.stringify(addToken({
                businessId: businessData._id,
                review: review
            }))
            })
            .then(() => window.location.reload(), (err) => console.error(err))
        
    }

    const services = {
        'Gym': {icon: <MdFitnessCenter />, component: <GymServiceDetails businessData={businessData.gymService}/>}, 
        'Personal Training': {icon: <MdOutlineSports />, component: <CoachingServiceDetails coachingServiceData={businessData.coachingElements}/>}, 
        'Events': {icon: <MdEvent />, component: <EventsDetails eventsData={businessData.events}/>}
    }

    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate();
    console.log(user)
    const handleFavorite = () => {
        if(!user){
            setOpenModal(true)
        }    
        else{
            fetch(`${process.env.REACT_APP_BACKEND_URL}${api_favorite_business}`, {
                method: "PUT",
                body: JSON.stringify(addToken({businessId: businessData._id}))
            })
            .then(data => data.json())
            .then(json => {setUser(json.user); setUserDetails(json)})
            .catch(err => console.error(err))
        }
    }

    const [reviews, setReviews] = useState(null)

    useEffect(() => {
        let url = new URL(`${process.env.REACT_APP_BACKEND_URL}${api_reviews}`)
        url.searchParams.set('businessId', businessData._id)
        
        fetch(url)
        .then(data => data.json())
        .then(json => {console.log("reviews: ", json); setReviews(json)})
        .catch(err => console.error(err))
    }, [businessData._id])

    const handleDelete = (id) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_reviews}`, {
            method: 'DELETE',
            body: addToken({reviewId: id})
        })
        .then(() => window.location.reload(), (err) => console.error(err))
    }

    return(
        <>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <ModalDialog>
                    <DialogTitle>This action requires you to sign in!</DialogTitle>
                    <Button className="generic-button" onClick={() => navigate({pathname: '/sign-in/', search: `?${createSearchParams({redirectTo: `/business-page/${businessData._id}`})}`})}>Take me to Sign In Page</Button>
                    <Button className="generic-button" onClick={() => setOpenModal(false)}>Take me Back</Button>
                </ModalDialog>
            </Modal>
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
            <div className="business-page-footer" style={{padding: '2vh'}}>
                
                {(!user || (user && user.username !== businessData.admin_user_id)) && <Button className="generic-button" style={{display: 'block', marginBlockEnd: '2vh'}} onClick={handleFavorite}><MdFavorite/>{ !user || !user.favorites || (user && user.favorites && !user.favorites.includes(businessData._id)) ? 'Favorite this spot!' : 'Unfavorite this spot ?'}</Button>}
                
                <hr></hr>
                <Typography level="h2" sx={{'textAlign': 'left'}}>Reviews</Typography>
                <div className="reviews-container">
                    {reviews && reviews.length === 0 
                     ? <div >No one has reviewed this spot yet!</div>
                     : reviews && reviews.map(it => 
                        <div className="review-container">
                                <div style={{textAlign: 'start', fontSize: 'x-small', marginBlockEnd: '0.5vh',}}>{it.user_id}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <div style={{overflow: 'auto'}}>
                                {it.review}
                                </div>
                                {it.user_id === user.username && <IconButton onClick={() => handleDelete(it._id)}><MdDelete/></IconButton>}
                            </div>
                            <div style={{textAlign: 'end', fontSize: 'x-small'}}>{it.creation_time}</div>
                        </div>
                    )}
                    {user 
                    ? <div className='review-input'>
                        <Input
                            sx={{backgroundColor: 'rgb(0,0,0,0)', color: 'black', borderTop: '0', borderInline: '0', borderWidth: '2px', borderColor: 'black', borderRadius: '0', marginBlockStart: '2vh'}}
                            value={review}
                            placeholder="Add a review"
                            onChange={(e) => setReview(e.target.value)}
                            endDecorator={<IconButton onClick={postReview}><MdSend></MdSend></IconButton>}
                        >
                        </Input>    
                    </div>
                    :   <Button className="generic-button" onClick={() => setOpenModal(true)}>Add a review</Button>}
                </div>
            </div>
        </>
    )

}