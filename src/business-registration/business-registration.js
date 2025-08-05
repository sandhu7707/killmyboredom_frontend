import { useCallback, useEffect, useState } from "react";
import Stepper from '@mui/joy/Stepper'
import Step from '@mui/joy/Step'
import StepIndicator from '@mui/joy/StepIndicator'
import StepButton from '@mui/joy/StepButton'
import BusinessLocation from './business-location/BusinessLocation'
import Finalize from './finalize/Finalize'
import BusinessDetails from './business-details/BusinessDetails'
import { businessDetailsSchema, gymServiceSchema, coachingServiceSchema, eventsSchema, locationSchema } from "./form-validation-utils/form-schemas";
import dayjs from 'dayjs';
import './business-registration.css'
import GymServiceDetails from "./gym-service-details/gym-service-details";
import CoachingServiceDetails from "./coaching-service-details/coaching-service-details";
import EventsDetails from "./events-details/events-details";
import { api_businessdata } from "../utils/constants";
import { useNavigate } from "react-router";
import { addToken } from "../utils/user-utils";
import { MdCheck } from "react-icons/md";

export default function BusinessRegistration({businessData, setBusinessData, onSave}){
    const [activeStep, setActiveStep] = useState(0)
    var [registrationData, setRegistrationData] = useState({
        contacts: [{}],
        businessType: [],
        gymService: {
            timeSlots: [{weekdays: [], timeSlots: [{ start: dayjs(), end: dayjs()}]}],
            basicFee: [{timePeriodInMonths: null, amount: null}],
            addOns: [{name: '', fee: [{timePeriodInMonths: null, amount: null}]}]
        },
        coachingElements:  [{timeSlots: [{timeSlots: [{start: dayjs(), end: dayjs()}], weekdays: []}], basicFee: [{name: '', fee: [{timePeriodInMonths: null, amount: null}]}], addOns: [{fee: [{}]}]}],
        events: [{timeRange: {start: dayjs(), end: dayjs()}, addOns: [{name: '', fee: [{}]}]}]
    });

    if(businessData){
        registrationData = businessData
    }

    if(setBusinessData){
        setRegistrationData = setBusinessData
    }

    const [stepHeadingFontSize, setStepHeadingFontSize] = useState(0)

    
    const handleNavigationTo = async (idx) => {

        if(activeStep < idx){
            let curr = activeStep;
            while(curr < idx){
                if(!(await steps[curr++].schema.isValid(registrationData))){
                    return;
                }
            }
        }
        setActiveStep(idx)
    }

    const incrementStep = () => {
        handleNavigationTo(activeStep+1)
    }

    const decrementStep = () => {
        setActiveStep(step => step - 1)
    }
    const navigate = useNavigate()
    const handleSave = onSave ? onSave : () => {
        let payload = addToken({businessData: registrationData});
        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_businessdata}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if(response.status === 200){
                alert('Successfully saved Business Details! Congratulation, You made it on the map.')
                navigate('/')
            }
        })
        .catch(error => console.log("error came back: ", error))
    }

    const updateSteps = (businessType) => {
        const additionalSteps = {
            'Gym': {heading: "Gym Service Details", schema: gymServiceSchema, component: <GymServiceDetails formData={registrationData} schema={gymServiceSchema} setFormData={setRegistrationData} incrementStep={incrementStep} decrementStep={decrementStep} />},
            'Personal Training': {heading: "Coaching Service Details", schema: coachingServiceSchema, component: <CoachingServiceDetails formData={registrationData} schema={coachingServiceSchema} setFormData={setRegistrationData} incrementStep={incrementStep} decrementStep={decrementStep}/>},
            'Events': {heading: "Events Details", schema: eventsSchema, component: <EventsDetails formData={registrationData} schema={eventsSchema} setFormData={setRegistrationData} incrementStep={incrementStep} decrementStep={decrementStep}/>}
        }

        const currentSteps = [
            {heading: "Business Details", schema: businessDetailsSchema, component: <BusinessDetails businessTypes={Object.keys(additionalSteps)} formData={registrationData} schema={businessDetailsSchema} setFormData={setRegistrationData} incrementStep={incrementStep}/>},
            {heading: "Business Location", schema: locationSchema, component: <BusinessLocation schema={locationSchema} formData={registrationData} setFormData={setRegistrationData} incrementStep={incrementStep} decrementStep={decrementStep}/>},
        ]

        businessType = businessType ? businessType : registrationData.businessType

        if(businessType){
            Object.keys(additionalSteps).forEach(it => {
                if(businessType.includes(it)){
                    currentSteps.push(additionalSteps[it])
                }
            })
        }
        
        currentSteps.push({heading: "Finalize", component: <Finalize registrationData={registrationData} decrementStep={decrementStep} handleSave={handleSave}/>})

        return currentSteps
    }

    let steps = updateSteps()

    const updateFontSize = useCallback(() => {
        let charsLength = steps.reduce((prev, curr) => prev + curr.heading.length, 0)
        let fontSize = 1.5 * (window.innerWidth/(2*charsLength))
        if(stepHeadingFontSize !== fontSize)
            setStepHeadingFontSize(fontSize)
    }, [steps, stepHeadingFontSize])

    updateFontSize()
    
    useEffect(() => {
        window.addEventListener('resize', updateFontSize)

        return () => {
            window.removeEventListener('resize', updateFontSize)
        }
    }, [updateFontSize])

    return(
        <div className="page-container">
            <div className='page-content'>
                <Stepper>
                    {steps.map((it, idx) => (
                        <Step
                            key={it.heading}
                            sx={{fontSize: stepHeadingFontSize}}
                            className="step-heading"
                            indicator={
                                <StepIndicator sx={{backgroundColor: 'white'}} className="step-indicator" variant={`${'soft'}`} color='primary'>
                                    {activeStep > idx ? <MdCheck/> : idx + 1}
                                </StepIndicator>
                            }
                        >
                            <StepButton sx={{marginInlineStart: '0.5vw', color: 'white'}} onClick={() => handleNavigationTo(idx)}>{it.heading}</StepButton>
                        </Step>
                    ))}
                </Stepper>
                <div className='step-content'>
                    {steps[activeStep].component}
                </div>
            </div>
        </div>
    )
}

