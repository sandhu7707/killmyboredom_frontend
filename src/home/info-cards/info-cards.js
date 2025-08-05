import Card from '@mui/joy/Card'
import './info-cards.css'


export default function InfoCards({cardsInfo, cardsWidth, cardsIntroWidth}){
    
    return(
        <>
            <div style={{minWidth: `${cardsIntroWidth}vw`, height: '100%', display: 'flex', flexDirection: 'column'}}>

            </div>
            {cardsInfo.map(it => (
                <Card key={it.headingId} variant="outlined" sx={{ minWidth: `${cardsWidth}vw`, margin: '1vw', backgroundSize: 'cover', backgroundImage: `url(${process.env.PUBLIC_URL + it.imgSrc})`, backgroundPosition: 'center'}}>
                    <div id={it.headingId} style={{opacity: 1}} className='card-heading-overlay'>
                        <h1 className='card-heading'>{it.heading}</h1>
                    </div>
                </Card>
            ))}
        </>
    )
}