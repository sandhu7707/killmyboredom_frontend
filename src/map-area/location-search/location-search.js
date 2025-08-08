
import IconButton from '@mui/joy/IconButton'
import Input from '@mui/joy/Input'
import Typography from '@mui/joy/Typography'
import Skeleton from '@mui/joy/Skeleton'
import { useEffect, useRef, useState } from 'react';
import { MdOutlineSearch } from "react-icons/md";
import './location-search.css'
import { api_geocode } from '../../utils/constants';

const debounce_interval = 500;

export default function LocationSearch({formatOverlaysForBlur, formatOverlaysForFocus, setIsMapActive, handleLocation}) {

    const [searchResults, setSearchResults] = useState(null)
    const [isWaitingForResults, setIsWaitingForResults] = useState(false)
    const inputRef = useRef(null)
    const debounce = useRef(null)

    const searchForStr = (searchStr) => {

        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_geocode}` + encodeURIComponent(searchStr),
         {
            method: 'GET'
         })
        .then(data => data.json())
        .then(json => {
            setSearchResults(json)
            setIsWaitingForResults(false)
        })
        .catch(err => {
            console.log(err)
            setIsWaitingForResults(false)
        })
        
    }


    const handleLocationSearchSubmit = (e) => {
        e.preventDefault()
        let searchStr = e.target.getElementsByTagName('input')[0].value
        searchForStr(searchStr)
    }

    const handleInputChange = (e) => {
        if(e.target.value.length > 2){
            if(debounce.current && debounce.current.timeout){
                clearTimeout(debounce.current.timeout)
            }
        setIsWaitingForResults(true)
        setIsMapActive(true)
            let timeout = setTimeout(() => searchForStr(e.target.value), debounce_interval);
            debounce.current = {timeout: timeout}
        }
        else{
            setSearchResults([])
            setIsWaitingForResults(false)
        }
    }

    useEffect(() => {
        const clearResultsOnClick = (e) => {
            if(e.target !== inputRef.current){
                setSearchResults([])
                inputRef.current.getElementsByTagName('input')[0].value = ''
            } 
        }

        window.addEventListener('click', clearResultsOnClick)

        return () => {
            window.removeEventListener('click', clearResultsOnClick)
            
            if(debounce.current && debounce.current.timeout){
                clearTimeout(debounce.current.timeout)
            }
        }
    }, [])

    const selectSearchResult = (result) => {
        handleLocation([result.lat, result.lng], result.bbox, result.displayname)
    }

    return (
        <div className='search-container'>
            <form onSubmit={handleLocationSearchSubmit} style={{ display: 'flex' }}>
                <Input ref={inputRef} onChange={handleInputChange} className='map-input' variant='plain' placeholder={`Enter location to start`} onFocus={formatOverlaysForFocus} onBlur={formatOverlaysForBlur} sx={{ backgroundColor: '#000000d4', color: 'white', flexGrow: 1, marginInline: '1vw', '&::before': { display: 'none' }, ':focus-within': { border: 'white solid 2px', color: 'white' } }}
                    endDecorator={<IconButton variant='solid' sx={{ backgroundColor: '#000000d4' }} type='submit'>
                        <MdOutlineSearch />
                    </IconButton>}
                    >
                </Input>
            </form>
            <div className='search-results-container'>
                <div className='search-results'>
                    {searchResults && searchResults.map(it => <Typography key={`${it.lat}${it.lng}`} onClick={() => selectSearchResult(it)} sx={{marginInline:'1vw'}} className="search-result">{it.displayname}</Typography>)}
                    {/* {isWaitingForResults && <div style={{marginInline: '1vw'}} className='search-result'><LinearProgress></LinearProgress></div>} */}
                    {isWaitingForResults && <Typography style={{marginInline: '1vw'}} className='search-result'><Skeleton>Lorem ipsum is placeholder text</Skeleton></Typography>}
                </div>
            </div>
        </div>
    )
}