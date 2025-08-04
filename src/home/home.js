import { useContext, useEffect, useRef } from "react";
import MapArea from "../map-area/map-area";
import InfoCards from "./info-cards/info-cards";
import IconButton from '@mui/joy/IconButton'
import { AiFillCaretUp } from "react-icons/ai";
import './home.css'
import SignInUser from "../signin-user/signin-user";
import { UserContext } from "../utils/user-utils";

const cardsInfo = {cardsInfo: [
  { headingId: 'card-0', imgSrc: '/gyms.png', heading: 'Explore Gyms' },
  { headingId: 'card-1', imgSrc: '/coaching.png', heading: 'Find Personal Training' },
  { headingId: 'card-2', imgSrc: '/events.png', heading: 'Discover Events' },
], cardsWidthVW: 50}

export default function Home() {

  const videoRef = useRef(null)
  const appNameRef = useRef(null)
  const cardsRef = useRef(null)
  const appNameContainerRef = useRef(null)
  const easyScrollButtonRef = useRef(null)
  const greetScreenRef = useRef(null)
  const innerHeightRef = useRef(null)

  const html = document.getElementsByTagName('html')[0];
  const body = document.getElementsByTagName('html')[0];
  const scrollingElement = html.scrollHeight >  window.innerHeight ? html : body;  


  useEffect(() => {
    const html = document.getElementsByTagName('html')[0];
    const body = document.getElementsByTagName('html')[0];
    const scrollingElement = html.scrollHeight >  window.innerHeight ? html : body;  

    innerHeightRef.current = window.innerHeight
    let animationLoopId;

    const handleAnimations = () => {

      // needed to give proper size in mobile user agents
      if(scrollingElement.scrollTop === 0){
        greetScreenRef.current.style.height = `${innerHeightRef.current}px`
      }

      let scrollVal = scrollingElement.scrollTop
      handleScrollDrivenAnimations(scrollVal, appNameContainerRef.current, cardsRef.current, easyScrollButtonRef.current, innerHeightRef.current)
      
      if(scrollVal > innerHeightRef.current/4){
          projectVideoToAppName(videoRef.current, appNameRef.current)
      }
      else{
        appNameRef.current.classList.remove('app-name-painted')
        appNameRef.current.style.backgroundImage = 'none'
        videoRef.current.style.visibility = 'visible'
      }

      animationLoopId = requestAnimationFrame(handleAnimations)
    }

    animationLoopId = requestAnimationFrame(handleAnimations)

    return () => {
      cancelAnimationFrame(animationLoopId)
    }
  }, [])

  const {user} = useContext(UserContext)

  return (
    <div className="home-container">
      <div className="translating-content">
        <div ref={greetScreenRef} id="greet-screen" className="greet-screen">
          <div className="sign-in-container">
            {!user && <SignInUser></SignInUser>}
          </div>
          <div ref={appNameContainerRef} className='app-name-container'>
            <div ref={appNameRef} id="appName" className='app-name'>
              Kill Your <br></br> Boredom
            </div>
          </div>
          <video ref={videoRef} id="greet-video" autoPlay muted loop className="greet-video-start">
            <source src="demo_video.mp4"></source>
          </video>
        </div>
        <div id="horizontal-cards" className="horizontal-cards">
          <div ref={cardsRef} id="horizontal-cards-content">
            <InfoCards cardsInfo={cardsInfo.cardsInfo} cardsWidth={cardsInfo.cardsWidthVW} cardsIntroWidth={cardsInfo.cardsWidthVW*1.5}></InfoCards>
          </div>
        </div>
        <MapArea></MapArea>
      </div>

      <div ref={easyScrollButtonRef} className="easy-scroll-container">
        <IconButton 
          variant="outlined" 
          onClick={() => {
            scrollingElement.scrollTo(0,0)
            innerHeightRef.current = window.innerHeight
          }} 
            
          sx={{width: '100%', height: '100%'}}
        >  
          <AiFillCaretUp style={{height: '100%', width: '100%'}}/>
        </IconButton>
      </div>
    </div>
  )
}

function handleScrollDrivenAnimations(scrollValue, appName, cards, easyScrollButton, innerHeight) {

  if (scrollValue < innerHeight / 2) {
    appName.style.color = 'white'
    let scroll = scrollValue / innerHeight
    if (innerHeight > window.innerWidth) {
      appName.style.fontSize = `${20 - scroll * 10}vw`
    }
    else {
      appName.style.fontSize = `${20 - scroll * 10}vh`
    }
    cards.style.transform = `translateX(0px)`
    easyScrollButton.style.visibility = 'hidden'
  }
  else {
    if (innerHeight > window.innerWidth) {
      appName.style.fontSize = `15vw`
    }
    else {
      appName.style.fontSize = `15vh`
    }
  }

  if (scrollValue > innerHeight/2 && scrollValue <  innerHeight) {


    let newScrollValue = scrollValue - innerHeight/2
    newScrollValue = (parseFloat(newScrollValue) / parseFloat(0.5*innerHeight)) * (cards.getBoundingClientRect().width-window.innerWidth/2)
    newScrollValue = newScrollValue > cards.getBoundingClientRect().width - window.innerWidth ? cards.getBoundingClientRect().width - window.innerWidth : newScrollValue

    cards.style.transform = `translateX(-${newScrollValue}px)`

    easyScrollButton.style.visibility = 'visible'

    let scroll = newScrollValue * 100 / window.innerWidth

    for (let i = 0; i < cardsInfo.cardsInfo.length; i++) {
      let card = document.getElementById(cardsInfo.cardsInfo[i].headingId)
      if (scroll > cardsInfo.cardsWidthVW * i + cardsInfo.cardsWidthVW / 2) {
        card.style.opacity = 1
      }
      else {
        card.style.opacity = 0
      }
    }
  }


  if (scrollValue > innerHeight) {
    cards.style.transform = `translateX(-${cards.getBoundingClientRect().width - window.innerWidth}px)`
    easyScrollButton.style.visibility = 'visible'
  }

}

function projectVideoToAppName(video, appName) {
  const imgUrl = captureVideo(video, appName.getBoundingClientRect().height, appName.getBoundingClientRect().width)
  appName.classList.add('app-name-painted')
  appName.setAttribute("style", `background-image: url(${imgUrl});`)
  video.style.visibility = 'hidden'
}


function captureVideo(video, height, width) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var canvasContext = canvas.getContext("2d");
  canvasContext.drawImage(video, 0, 0);
  return canvas.toDataURL('image/png');
}
