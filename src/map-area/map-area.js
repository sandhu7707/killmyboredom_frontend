import L from 'leaflet'
import { useCallback, useEffect, useRef, useState } from 'react'
import './map-area.css'
import Button from '@mui/joy/Button'
import LocationSearch from './location-search/location-search'
import { useNavigate } from 'react-router'
import Typography from '@mui/joy/Typography'
import IconButton from '@mui/joy/IconButton'
import { MdPushPin } from "react-icons/md";
import { useContext } from 'react'
import { UserContext } from '../utils/user-utils'
import { api_business_coords } from '../utils/constants'
import { MdFitnessCenter, MdOutlineSports, MdEvent } from "react-icons/md"

const services = {
    'Gym': {icon: <MdFitnessCenter />}, 
    'Personal Training': {icon: <MdOutlineSports />}, 
    'Events': {icon: <MdEvent />}
}

export default function MapArea({ isPinMode, handleLocationCallback, defaultPins }) {

    let navigate = useNavigate()

    const blurOverlay = useRef(null)
    const focusOverlay = useRef(null)
    const map = useRef(null)
    const recording = useRef(null)

    const [enterManually, setEnterManually] = useState(false);
    const [isMapActive, setIsMapActive] = useState(isPinMode)

    const [businessCoords, setBusinessCoords] = useState([]);
    
    const popupRef = useRef(null)
    const [businessInPopup, setBusinessInPopup] = useState(null)

    const addMarkerPin = useCallback((coords, draggable=true, businessData) => {
        let markerPin = L.marker([coords.lat, coords.lng], {draggable: draggable});

        markerPin.addTo(map.current)
        markerPin.addEventListener('click', (e) => {
            if(businessData){
                setBusinessInPopup(businessData)
            }
            popupRef.current.style.left = `${e.containerPoint.x}px`
            popupRef.current.style.top = `${e.containerPoint.y}px`
            popupRef.current.style.visibility = 'visible'
        })
        map.current.addEventListener('mousedown', (e) => {
            popupRef.current.style.visibility = 'hidden'
        })

        if(handleLocationCallback){
            markerPin.addEventListener('dragend', (e) => {handleLocationCallback({...e.target._latlng})})
        }
    }, [handleLocationCallback])


    const pinCoords = useCallback((coords, draggable=false, businessData) => {
        addMarkerPin(coords, draggable, businessData)
        recording.current = false
        map.current._container.style.cursor = 'grab'
                
        if(handleLocationCallback){
            handleLocationCallback(coords)
        }
    }, [handleLocationCallback, addMarkerPin])

    useEffect(() => {
        if(!isPinMode && businessCoords.length === 0 ){
            fetch(`${process.env.REACT_APP_BACKEND_URL}${api_business_coords}`)
            .then(data => data.json())
            .then(json => setBusinessCoords(json))
            .catch(err => console.error('Error trying to fetch business coords: ', err))
        }
    }, [isPinMode, businessCoords.length])

    useEffect(() => {
        for(let businessCoord of businessCoords){
            if(businessCoord && businessCoord.location && !businessCoord.mapped){
                pinCoords(businessCoord.location, false, businessCoord)
            }
        }
    }, [businessCoords, pinCoords])

    useEffect(() => {

        let minLat = 21.82         //setting bounds to fit northern area of india
        let minLong = 69.37
        let maxLat = 35.92
        let maxLong = 81.41

        let corner1 = L.latLng(minLat, minLong)
        let corner2 = L.latLng(maxLat, maxLong)

        let maxBounds = L.latLngBounds(corner1, corner2)

        map.current = L.map('map', {
            zoomControl: false,
            maxBounds: maxBounds,
            maxBoundsViscosity: 1,
            minZoom: 7,
            maxZoom: 17,
        });


        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map.current);

        map.current.setView([30.3301995, 76.4007656], 13)       //setting view to Patiala
        map.current.fitBounds([
            [30.2893, 76.3342254],
            [30.3818198, 76.466984]
        ])


        const recordCoordsOnClick = (e) => {       
            if(recording.current){
                pinCoords({lat: e.latlng.lat, lng: e.latlng.lng})
            }
        }

        map.current.on('click', recordCoordsOnClick) 

        if(isPinMode && defaultPins[0]){
            addMarkerPin(defaultPins[0])
        }


        return () => {
            map.current.remove(); 
            map.current.off('click', recordCoordsOnClick)
        }
    }, [addMarkerPin, defaultPins, isPinMode, pinCoords])

    const formatOverlaysForBlur = () => {
        blurOverlay.current.style.opacity = 1;
        focusOverlay.current.style.opacity = 0;
    }

    const formatOverlaysForFocus = () => {
        blurOverlay.current.style.opacity = 0;
        focusOverlay.current.style.opacity = 1;
    }

    const detectLocation = () => {
        // formatOverlaysForFocus()
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // pinCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
                    setIsMapActive(true)
                    map.current.setView([position.coords.latitude, position.coords.longitude])
                },
                (error) => {
                    alert('cannot detect location, please enter your location manually')
                    setEnterManually(true)
                }
            )
        }
    }

    const handleLocation = (coords, bbox, displayName) => {
        map.current.setView(coords)
        map.current.fitBounds(bbox)
        pinCoords({lat:coords[0], lng: coords[1]})
    }

    let user = useContext(UserContext).user;

    return (
        <div className='map-container'>
            <>
                <div className={`map-overlay ${isMapActive ? "map-overlay-menu" : "map-overlay-expanded"}`}>
                    <div className='map-overlay-greeting'>
                        <div className='map-overlay-heading' style={{ display: 'flex', width: '100%', color: 'black' }}>
                            {!enterManually && !isMapActive &&
                                <>
                                    <Button onClick={detectLocation} sx={{ width: '50%', marginInline: 'auto', marginBlock: '2%' }}>Detect Location</Button>
                                    or
                                    <Button onClick={() => { setEnterManually(true) }} sx={{ width: '50%', marginInline: 'auto', marginBlock: '2%' }}>Enter Manually</Button>
                                </>}
                            {(enterManually || isMapActive) &&
                                <>
                                    {isPinMode && <Typography sx={{margin: '1vh', fontSize: '1.2vw'}}>Please Pin your Business's Location using the <MdPushPin></MdPushPin> icon in map </Typography>}
                                    <LocationSearch
                                        formatOverlaysForBlur={formatOverlaysForBlur}
                                        formatOverlaysForFocus={formatOverlaysForFocus}
                                        setIsMapActive={setIsMapActive}
                                        handleLocation={handleLocation}
                                    />
                                    {!isMapActive &&
                                        <>
                                            or
                                            <Button onClick={detectLocation} sx={{ width: '50%', marginInline: 'auto', marginBlock: '2%' }}>Detect Location</Button>
                                        </>}
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div ref={focusOverlay} className={`inactive-map-overlay ${isMapActive ? "map-overlay-menu" : "map-overlay-expanded"} map-overlay-on-input-focus`}></div>
                <div ref={blurOverlay} className={`inactive-map-overlay ${isMapActive ? "map-overlay-menu" : "map-overlay-expanded"} map-overlay-on-input-blur`}></div>
            </>

            {isPinMode && 
                <IconButton onClick={() => {recording.current = true; map.current._container.style.cursor = 'pointer';}} className='pin-button' variant='soft' >
                    <MdPushPin></MdPushPin>
                </IconButton>
            }
            {!isPinMode && <div tabIndex={0} className="business-registration">
                <div tabIndex={0} className="business-registration-content">
                    <Button onClick={() => user ? navigate('/business-registration') : navigate('/register-user')}>Register</Button><br></br> Your Business <br></br>Now!!
                </div>
                <div className='buisiness-registration-page-turn' style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/page-turn.svg)` }}>
                </div>
            </div>}

            <div ref={popupRef} className='business-popup'>
                {businessInPopup && <>
                    <div>
                        <div>
                            <Typography level='h3'>{businessInPopup.businessName}</Typography>
                        </div>
                        <Typography ><Typography>{businessInPopup.address}</Typography><Typography>{businessInPopup.city}</Typography><Typography>{businessInPopup.state}</Typography></Typography>
                    </div>

                    <div>
                        {Object.keys(services).map(it => <>
                            {
                                businessInPopup.businessType.includes(it) &&
                                <div style={{textAlign: 'start'}}>
                                    <Typography level="h5" sx={{ display: 'inline'}}>{it}{services[it].icon}</Typography>
                                </div>
                            }
                        </>)}
                    </div>
                    <Button sx={{width: '100%', marginBlockStart: '3px'}} onClick={() => {navigate(`/business-page/${businessInPopup.id}`)}}>Business Page</Button>
                </>}
            </div>

            <div id="map" className="interact-screen">

            </div>
        </div>
    )
}