import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'
import './map-area.css'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import IconButton from '@mui/joy/IconButton'
import { MdOutlineSearch } from "react-icons/md";

export default function MapArea() {

    const blurOverlay = useRef(null)
    const focusOverlay = useRef(null)
    const map = useRef(null)

    const [currentLocation, setCurrentLocation] = useState(null)
    const [enterManually, setEnterManually] = useState(false);
    const [searchResults, setSearchResults] = useState(null)

    useEffect(() => {

        let minLat = 29.444         //fix bounds to fit northern area in india
        let minLong = 73.515
        let maxLat = 32.431
        let maxLong = 77.119

        let corner1 = L.latLng(minLat, minLong)
        let corner2 = L.latLng(maxLat, maxLong)

        let maxBounds = L.latLngBounds(corner1, corner2)

        map.current = L.map('map', {
            zoomControl: false,
            maxBounds: maxBounds,
            maxBoundsViscosity: 1,
            minZoom: 7,
            maxZoom: 17,
        }).setView([51.505, -0.09], 13);


        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map.current);

        map.current.setView([30.3301995, 76.4007656])
        map.current.fitBounds([
            [30.2893, 76.3342254],
            [30.3818198, 76.466984]
        ])


        return () => { map.current.remove(); }
    }, [])

    const handleFocus = (e) => {
        if (e.type === 'blur') {
            blurOverlay.current.style.opacity = 1;
            focusOverlay.current.style.opacity = 0;
        }
        else if (e.type === 'focus') {
            blurOverlay.current.style.opacity = 0;
            focusOverlay.current.style.opacity = 1;
        }
    }

    const detectLocation = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position)
                    setCurrentLocation({lat: position.coords.latitude, lng: position.coords.longitude})
                    map.current.setView([position.coords.latitude, position.coords.longitude])
                },
                (error) => {
                    alert('cannot detect location, please enter your location manually')
                    setEnterManually(true)
                }
            )
        }
    }

    const handleLocationSearchSubmit = (e) => {
        e.preventDefault()
        
        let searchStr = e.target.getElementsByTagName('input')[0].value
        fetch('http://localhost:3000/mapping/geocode/' + encodeURIComponent(searchStr), {method: 'GET'})
        .then(data => data.json())
        .then(json => {
            console.log("data received: ", json)
            setSearchResults(json)
        })
        .catch(err => console.log(err))
    }


    return (
        <div className='map-container'>
            {!currentLocation && 
            <>
                <div className='map-overlay map-overlay-expanded'>
                    <div className='map-overlay-greeting'>
                        <div className='map-overlay-heading' style={{ display: 'flex', width: '100%', color: 'black' }}>
                            {!currentLocation && !enterManually &&
                            <>
                                <Button onClick={detectLocation} sx={{width: '50%', marginInline: 'auto', marginBlock: '2%'}}>Detect Location</Button>
                                or
                                <Button onClick={() => {setEnterManually(true)} } sx={{width: '50%', marginInline: 'auto', marginBlock: '2%'}}>Enter Manually</Button>
                            </>}
                            {enterManually && 
                            <>
                                <form onSubmit={handleLocationSearchSubmit} style={{display: 'flex'}}>
                                <Input className='map-input' variant='plain' placeholder="Enter location to start" onFocus={handleFocus} onBlur={handleFocus} sx={{ backgroundColor: '#000000d4', color: 'white', flexGrow: 1, marginInline: '1vw', '&::before': { display: 'none' }, ':focus-within': { border: 'white solid 2px' } }}></Input>
                                <IconButton variant='solid' sx={{backgroundColor: '#000000d4'}} type='submit'>
                                    <MdOutlineSearch />
                                </IconButton>
                                </form>
                                or
                                <Button onClick={detectLocation} sx={{width: '50%', marginInline: 'auto', marginBlock: '2%'}}>Detect Location</Button>
                            </>
                            }
                            {enterManually && searchResults && searchResults.map(it => <>{it.displayname}</>)}
                        </div>
                    </div>
                </div>
                <div ref={focusOverlay} className='inactive-map-overlay map-overlay-on-input-focus'></div>
                <div ref={blurOverlay} className='inactive-map-overlay map-overlay-on-input-blur'></div>
            </>}
            
            <div tabIndex={0} className="business-registration">
                <div tabIndex={0} className="business-registration-content">
                    Register <br></br>Now!!
                </div>
                <div className='buisiness-registration-page-turn' style={{backgroundImage: `url(${process.env.PUBLIC_URL}/page-turn.svg)`}}>
                </div>
            </div>

            {currentLocation && <div className='map-menu'>
                Here will be the map-menu
            </div>}

            <div id="map" className="interact-screen"></div>
        </div>
    )
}