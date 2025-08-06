import Card from '@mui/joy/Card'
import './info-cards.css'
import { useState } from 'react'


export default function InfoCards({cardsInfo, cardsWidth, cardsIntroWidth}){
    const [backFace, setBackFace] = useState(new Array(cardsInfo.length))
    console.log(backFace)
    return(
        <>
            {cardsInfo.map((it,idx) => (
                <Card onClick={() => {setBackFace(backFace => {let newBackface = [...backFace]; newBackface[idx] = !newBackface[idx]; return newBackface})}} key={it.headingId} variant="outlined" sx={{transform: backFace[idx] ? 'rotateY(360deg)' : 'rotate(0)', transition: 'transform 0.25s ease', cursor: 'pointer', minWidth: `${cardsWidth}vw`, margin: '1vw', backgroundSize: 'cover', backgroundImage: `url(${process.env.PUBLIC_URL + it.imgSrc})`, backgroundPosition: 'center'}}>
                    {backFace[idx] ? 
                        <div id={it.headingId} style={{opacity: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='card-heading-overlay'>
                            <h1 className='card-heading' >{it.description}</h1>
                        </div>
                    : <div id={it.headingId} style={{opacity: 1}} className='card-heading-overlay'>
                        <h1 className='card-heading'>{it.heading}</h1>
                    </div>}
                </Card>
            ))}
        </>
    )
}