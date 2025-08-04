import { useEffect, useRef } from "react"

export default function Heatmap({options}){

    const canvasRef = useRef(null)
    const canvasHeight = window.innerHeight
    const canvasWidth = window.innerWidth

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d')
        const tickCount = options.xLabels.length;
        const tickLength = 10;
        const xUnitLength = canvasWidth*0.8/tickCount
        const yUnitLength = canvasHeight*0.8/(2*(options.yLabels.length +1))

        const origin = [canvasWidth*0.1, canvasHeight*(1-0.1)]
        const xAxisEnd = [canvasWidth*(1-0.1), origin[1]]
        ctx.strokeStyle = options.strokeColor

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(...origin)
        ctx.lineTo(...xAxisEnd)
        ctx.stroke()
        
        for(let i=0; i<tickCount; i++){
            
            ctx.lineWidth = 0.25
            ctx.beginPath()
            ctx.moveTo(canvasWidth*0.1 + xUnitLength*i, canvasHeight*0.1 + yUnitLength)
            ctx.lineTo(canvasWidth*0.1 + xUnitLength*i, origin[1])
            // ctx.closePath()
            ctx.stroke()

            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(canvasWidth*0.1 + xUnitLength*i, origin[1]+tickLength/2)
            ctx.lineTo(canvasWidth*0.1 + xUnitLength*i, origin[1]-tickLength/2)
            // ctx.closePath()
            ctx.stroke()
        }

        let xLabelsRaw = options.xLabels

        ctx.font = '40px Roboto'
        if(window.innerWidth < 768){
            ctx.font = '30px Roboto'
            let keep = true;
            let halfKeep = true;
            let xLabelsNew = []
            for(let x=0; x<xLabelsRaw.length; x++){
                if(keep){
                    xLabelsNew.push({idx: x, label: xLabelsRaw[x]})
                }

                if(window.innerWidth < 480){
                    ctx.font = '30px Roboto'
                    if(!keep && halfKeep){
                        keep = true
                    }
                    else if(keep && halfKeep){
                        keep = false
                        halfKeep = false
                    }
                    else if(!halfKeep){
                        halfKeep = true
                    }
                }
                else{
                    keep = !keep
                }
            }
            xLabelsRaw = xLabelsNew
        }
        else{
            xLabelsRaw = xLabelsRaw.map((it, idx) => {return {idx: idx, label:it}})
        }

        ctx.fillStyle = options.strokeColor
        // ctx.font = `${(canvasWidth*0.8)*1.5/(xLabelsRaw.length*4)}px Roboto`
        for(let xLabel of xLabelsRaw){
            ctx.fillText(xLabel.label, origin[0]+xLabel.idx*xUnitLength, canvasHeight*(1-0.05), (canvasWidth*0.8)/(xLabelsRaw.length)*0.7)
            ctx.strokeText(xLabel.label, origin[0]+xLabel.idx*xUnitLength, canvasHeight*(1-0.05), (canvasWidth*0.8)/(xLabelsRaw.length)*0.7)
        }

        // ctx.font = `${(canvasWidth*0.06)*1.5/3}px Roboto`
        for(let i=1; i<=options.yLabels.length; i++){

            ctx.lineWidth = 0.25
            ctx.beginPath()
            ctx.moveTo(canvasWidth*0.1, canvasHeight*(0.1) + (2*i)*yUnitLength)
            ctx.lineTo(canvasWidth*0.9, canvasHeight*(0.1) + (2*i)*yUnitLength)
            ctx.moveTo(canvasWidth*0.1, canvasHeight*(0.1) + (2*i+1)*yUnitLength)
            ctx.lineTo(canvasWidth*0.9, canvasHeight*(0.1) + (2*i+1)*yUnitLength)
            ctx.stroke()


            ctx.fillStyle = options.strokeColor
            ctx.fillText(options.yLabels[i-1].slice(0,3), canvasWidth*0.02, canvasHeight*(0.1) + (2*i+1)*yUnitLength, canvasWidth*0.05)
            ctx.strokeText(options.yLabels[i-1].slice(0,3), canvasWidth*0.02, canvasHeight*(0.1) + (2*i+1)*yUnitLength, canvasWidth*0.05)
            if(options.filledSlots[options.yLabels[i-1]]){
                for(let slot of options.filledSlots[options.yLabels[i-1]]){
            ctx.fillStyle = options.fillColor
                    ctx.rect((canvasWidth*0.1 + slot.start*xUnitLength), canvasHeight*(0.1) + 2*i*yUnitLength, (slot.end - slot.start)*xUnitLength, yUnitLength)
                    ctx.fill()
                }
            }
        }
    }, [canvasWidth, canvasHeight, options])

    return(
        <div style={{width: '100%'}}>
            <canvas ref={canvasRef} height={canvasHeight} width={canvasWidth} style={{ backgroundColor: options.emptyColor, width: '100%', height: '400px'}}>
            </canvas>
        </div>
    )
}