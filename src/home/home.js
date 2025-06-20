import { useEffect, useRef } from "react";
import MapArea from "./map-area/map-area";
import InfoCards from "./info-cards/info-cards";
import IconButton from '@mui/joy/IconButton'
import { AiFillCaretUp } from "react-icons/ai";
import './home.css'

const cardsInfo = {cardsInfo: [
  { headingId: 'card-0', imgSrc: '/gyms.png', heading: 'Explore Gyms' },
  { headingId: 'card-1', imgSrc: '/coaching.png', heading: 'Find Personal Training' },
  { headingId: 'card-2', imgSrc: '/events.png', heading: 'Discover Events' },
], cardsWidthVW: 50}

function disableDefaultScroll() {
  document.getElementsByTagName('html')[0].style.overflow = 'hidden'
  document.getElementsByTagName('body')[0].style.overflow = 'hidden'
}

function reenableDefaultScroll() {
  document.getElementsByTagName('html')[0].style.overflow = 'scroll'
  document.getElementsByTagName('body')[0].style.overflow = 'scroll'
}


export default function Home() {

  const scrollValueRef = useRef(0)
  const touchStartValueRef = useRef(null)
  const translatingContentRef = useRef(null)
  const videoRef = useRef(null)
  const appNameRef = useRef(null)
  const cardsRef = useRef(null)
  const appNameContainerRef = useRef(null)
  const easyScrollButtonRef = useRef(null)
  const greetScreenRef = useRef(null)

  const handleMouseWheel = (e) => {
    let newScrollValue = scrollValueRef.current + e.deltaY * 0.5;

    newScrollValue = newScrollValue < 0 ? 0 : newScrollValue;
    newScrollValue = newScrollValue > 3 * window.innerHeight ? 3 * window.innerHeight : newScrollValue
    scrollValueRef.current = newScrollValue;

  }

  const handleTouchMove = (e) => {
    let scrolledBy = touchStartValueRef.current.y - e.changedTouches[0].clientY
    scrolledBy = scrolledBy > 20 ? 20 : scrolledBy;
    let newScrollValue = scrollValueRef.current + scrolledBy

    newScrollValue = newScrollValue < 0 ? 0 : newScrollValue;
    newScrollValue = newScrollValue > 3 * window.innerHeight ? 3 * window.innerHeight : newScrollValue

    scrollValueRef.current = newScrollValue;
  }

  const handleTouchStart = (e) => { touchStartValueRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }


  useEffect(() => {
    disableDefaultScroll()
    window.addEventListener('mousewheel', handleMouseWheel)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchstart', handleTouchStart)

    let lastFrameTime = performance.now()
    let animationLoopId;

    const handleAnimations = () => {

      if(performance.now() - lastFrameTime < 300){
        requestAnimationFrame(handleAnimations)
        return
      }
      
      lastFrameTime = performance.now()
      //needed to give proper size in mobile user agents
      if(scrollValueRef.current === 0){
        greetScreenRef.current.style.height = `${window.innerHeight}px`
      }

      handleScrollDrivenAnimations(scrollValueRef.current, appNameContainerRef.current, translatingContentRef.current, cardsRef.current, easyScrollButtonRef.current)
      
      if(scrollValueRef.current > window.innerHeight/2){
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
      reenableDefaultScroll();
      window.removeEventListener('mousewheel', handleMouseWheel)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
      cancelAnimationFrame(animationLoopId)
    }
  }, [])
  return (
    <div className="home-container">
      <div ref={translatingContentRef} className="translating-content">
        <div ref={greetScreenRef} id="greet-screen" className="greet-screen">
          <div className="sign-in-container">

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
        <IconButton variant="outlined" onClick={() => { scrollValueRef.current = 0 }} sx={{width: '100%', height: '100%'}}>
          <AiFillCaretUp style={{height: '100%', width: '100%'}}/>
        </IconButton>
      </div>
    </div>
  )
}

function handleScrollDrivenAnimations(scrollValue, appName, translatingContent, cards, easyScrollButton) {

  if (scrollValue < window.innerHeight / 2) {

    let scroll = scrollValue / window.innerHeight
    if (window.innerHeight > window.innerWidth) {
      appName.style.fontSize = `${20 - scroll * 10}vw`
    }
    else {
      appName.style.fontSize = `${20 - scroll * 10}vh`
    }
    translatingContent.style.transform = `translateY(-${scrollValue}px)`
    cards.style.transform = `translateX(0px)`
    easyScrollButton.style.visibility = 'hidden'
  }
  else {
    if (window.innerHeight > window.innerWidth) {
      appName.style.fontSize = `15vw`
    }
    else {
      appName.style.fontSize = `15vh`
    }
  }

  if (scrollValue > window.innerHeight/2 && scrollValue < 2 * window.innerHeight) {

    let newScrollValue = scrollValue - window.innerHeight

    newScrollValue = (newScrollValue / (window.innerHeight)) * (cards.getBoundingClientRect().width)

    newScrollValue = newScrollValue > cards.getBoundingClientRect().width - window.innerWidth ? cards.getBoundingClientRect().width - window.innerWidth : newScrollValue

    cards.style.transform = `translateX(-${newScrollValue}px)`

    translatingContent.style.transform = `translateY(-${window.innerHeight / 2}px)`
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


  if (scrollValue > 2 * window.innerHeight) {
    cards.style.transform = `translateX(-${cards.getBoundingClientRect().width - window.innerWidth}px)`
    let newScrollValue = scrollValue - window.innerHeight

    newScrollValue = newScrollValue > translatingContent.getBoundingClientRect().height - window.innerHeight ?
      translatingContent.getBoundingClientRect().height - window.innerHeight : newScrollValue;

    translatingContent.style.transform = `translateY(-${newScrollValue}px)`
    
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
