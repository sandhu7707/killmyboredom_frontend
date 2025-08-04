import Button from "@mui/joy/Button";
import { InternalFormComponent, InternalInputFieldComponent, InternalListFieldComponent, InternalSubmitButtonComponent, InternalTimeRangeComponent } from "../form-utils/form-components";
import dayjs from "dayjs";

export default function EventServiceDetails({ formData, setFormData, schema, incrementStep, decrementStep }) {
    
    return <>
        <InternalFormComponent formData={formData} setFormData={setFormData} schema={schema} onSubmit={incrementStep}>

            <fieldset>
                <InternalListFieldComponent
                    name={'events'}
                    displayName={'Events'}
                    defaultValue={{timeRange: {start: dayjs(), end: dayjs()}, addOns: [{name: '', fee: [{}]}]}}
                    itemComponent={({idx}) =>
                        <fieldset> 
                            <InternalInputFieldComponent
                                name='name'
                                displayName={'Name'}
                                path={['events', idx]}
                            />
                            <InternalInputFieldComponent
                                textarea={true}
                                name='description'
                                displayName={'Description'}
                                path={['events', idx]}
                            />
                            <InternalTimeRangeComponent
                                name={'timeRange'}
                                displayName={'Time'}
                                path={['events', idx, 'timeRange']}
                            />
                            <InternalInputFieldComponent
                                name='basicFee'
                                displayName={'Basic Fee'}
                                path={['events', idx]}
                            />
                            <InternalListFieldComponent
                                name='addOns'
                                displayName={'Add Ons'}
                                path={['events', idx]}
                                inlineListButtons={true}
                                defaultValue={{name: '', fee: [{}]}}
                                itemComponent={({ idx: innerIdx }) =>
                                    <fieldset style={{marginBlockStart: '0'}}>
                                        <InternalInputFieldComponent
                                            name='name'
                                            path={['events', idx, 'addOns', innerIdx]}
                                            displayName={'Name'}
                                        />
                                        <InternalInputFieldComponent
                                            name={'fee'}
                                            displayName={'Fee'}
                                            path={['events', idx, 'addOns', innerIdx]}
                                            type='number'
                                        />
                                    </fieldset>
                                }
                            />
                        </fieldset>}
                />
            </fieldset>

            <div className='stepper-buttons'>
                <InternalSubmitButtonComponent label={"Next"} />
                <Button sx={{ float: 'left', marginBlock: '2vh' }} onClick={decrementStep}>Previous</Button>
            </div>
        </InternalFormComponent>
    </>;
}