import Card from '@mui/joy/Card'
import { MdCurrencyRupee } from "react-icons/md";

export default function FeeCards({basicFee, addOns}){

    return(
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
            {basicFee && <FeeCard  isBasic={true} fee={basicFee}/>}
            {addOns.map(it => <FeeCard  name={it.name} fee={it.fee}/>)}
        </div>
    )

}


function FeeCard({isBasic=false, name, fee}){

    return(
        <>
            { !isBasic && !name ? <></> :
            <Card variant="outlined" sx={{ minWidth: '20%', maxWidth: `40%`, margin: '1vw', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div>
                    <h1>{isBasic ? 'Basic' : name}</h1>
                    {
                        fee.map((it) => <Card style={{marginBlock: '3%', paddingBlock: '0'}}><h3 style={{fontWeight: 300}}>{it.timePeriodInMonths} Months: <MdCurrencyRupee/>{it.amount}</h3></Card>)
                    }
                </div>
            </Card>}
        </>
    )
}