import Button from "@mui/joy/Button";
import { InternalFormComponent, InternalInputFieldComponent, InternalListFieldComponent, InternalSubmitButtonComponent } from "../form-utils/form-components";
import dayjs from 'dayjs';
import { TimeSlotsAndFee } from "../gym-service-details/gym-service-details";

export default function CoachingServiceDetails({ formData, setFormData, schema, incrementStep, decrementStep }) {

    return <>
        <InternalFormComponent formData={formData} setFormData={setFormData} schema={schema} onSubmit={incrementStep}>

                <InternalListFieldComponent
                    name='coachingElements'
                    displayName={'Elements'}
                    defaultValue={{timeSlots: [{timeSlots: [{start: dayjs(), end: dayjs()}], weekdays: []}], basicFee: [{name: '', fee: [{timePeriodInMonths: null, amount: null}]}], addOns: [{fee: [{}]}]}}
                    itemComponent={({idx}) => <fieldset>
                        <InternalInputFieldComponent
                            name='name'
                            displayName={'Name'}
                            path={['coachingElements', idx]}
                        />
                        <InternalInputFieldComponent
                            name='description'
                            displayName={'Description'}
                            textarea={true}
                            path={['coachingElements', idx]}
                        />
                        <TimeSlotsAndFee formData={formData} setFormData={setFormData} parentPath={['coachingElements', idx]}/>         
                    </fieldset>}
                />

            <div className='stepper-buttons'>
                <Button className="generic-button" sx={{marginBlockStart: '3vh', color: 'white', marginInlineEnd: 'auto'}} onClick={decrementStep}>Previous</Button>
                <InternalSubmitButtonComponent label={"Next"} />
            </div>
        </InternalFormComponent>
    </>;
}