import dayjs from 'dayjs';
import { InternalFormComponent, InternalSelectFieldComponent, InternalListFieldComponent, InternalInputFieldComponent, InternalSubmitButtonComponent, InternalTimeRangeComponent, getValueAtPath } from "../form-utils/form-components";
import Button from "@mui/joy/Button";

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function TimeSlotsAndFee({formData, setFormData, parentPath=[]}){
    

    const selectedWeekdays = getValueAtPath(formData, [...parentPath, 'timeSlots']).reduce((prev, curr) => prev.concat(curr.weekdays), [])
    const unselectedWeekdays = weekDays.filter(it => !selectedWeekdays.includes(it))
    return (
            <>
                <fieldset>
                    <InternalListFieldComponent
                        name="timeSlots"
                        displayName={'Opening Times'}
                        path={parentPath}
                        defaultValue={{ weekdays: [], timeSlots: [{ start: dayjs(), end: dayjs() }] }}
                        disableAdd={unselectedWeekdays.length === 0}
                        itemComponent={(({ it, idx }) =>
                            <fieldset style={{marginBlockStart: '0'}}>
                                <InternalSelectFieldComponent
                                    name={"weekdays"}
                                    label={false}
                                    className="form-label"  
                                    displayName={"Weekdays"}
                                    multiple={true}
                                    path={[...parentPath, 'timeSlots', idx]}
                                    options={(unselectedWeekdays.concat(it.weekdays)).map(it => { return { value: it, label: it } })}
                                />
                                <InternalListFieldComponent
                                    label={false}
                                    inlineListButtons={true}
                                    className="form-input"
                                    name="timeSlots"
                                    defaultValue={{ start: dayjs(), end: dayjs() }}
                                    path={[...parentPath, 'timeSlots', idx]}
                                    itemComponent=
                                    {({ it: itInner, idx: idxInner }) => {
                                        return <InternalTimeRangeComponent
                                            name={`timeSlot${idxInner}`}
                                            label={false}
                                            path={[...parentPath, 'timeSlots', idx, 'timeSlots', idxInner]}
                                        />
                                    }
                                    } />
                            </fieldset>
                        )} />
                </fieldset>
                
                    <fieldset>
                        <InternalListFieldComponent
                            name={'basicFee'}
                            displayName={'Basic Fee'}
                            path={parentPath}
                            defaultValue={{ timePeriodInMonths: null, amount: null }}
                            itemComponent={({ idx }) =>
                                <fieldset style={{marginBlockStart: '0'}}>
                                    <InternalInputFieldComponent
                                        name={'timePeriodInMonths'}
                                        displayName={'Time Period (in months)'}
                                        path={[ ...parentPath, 'basicFee', idx]}
                                        type='number'
                                    />
                                    <InternalInputFieldComponent
                                        name={'amount'}
                                        displayName={'Fee'}
                                        path={[...parentPath, 'basicFee', idx]}
                                        type='number'
                                    />
                                </fieldset>}
                        />
                    </fieldset>

                    <fieldset>
                        <InternalListFieldComponent
                            name='addOns'
                            displayName={'Add Ons'}
                            path={parentPath}
                            itemComponent={({ idx }) =>
                                <fieldset style={{marginBlockStart: '0'}}>
                                    <InternalInputFieldComponent
                                        name='name'
                                        path={[...parentPath, 'addOns', idx]}
                                        displayName={'Name'}
                                    />
                                    <InternalListFieldComponent
                                        name='fee'
                                        path={[...parentPath, 'addOns', idx]}
                                        displayName={'Fee'}
                                        inlineListButtons={true}
                                        itemComponent={({ idx: idxInner }) =>
                                            <fieldset style={{ marginBlockStart: '0'}}>
                                                <InternalInputFieldComponent
                                                    name={'timePeriodInMonths'}
                                                    displayName={'Time Period (in months)'}
                                                    path={[...parentPath, 'addOns', idx, 'fee', idxInner]}
                                                    type='number'
                                                />
                                                <InternalInputFieldComponent
                                                    name={'amount'}
                                                    displayName={'Fee'}
                                                    path={[...parentPath, 'addOns', idx, 'fee', idxInner]}
                                                    type='number'
                                                />
                                            </fieldset>
                                        }
                                    />
                                </fieldset>
                            }
                        />
                    </fieldset>

                

            </>
    )
}

export default function GymServiceDetails({ formData, setFormData, schema, incrementStep, decrementStep }) {

    return (
        <InternalFormComponent formData={formData} setFormData={setFormData} schema={schema} onSubmit={incrementStep}>
            <TimeSlotsAndFee
                formData={formData}
                setFormData={setFormData}
                parentPath={['gymService']}
            />
            <div className='stepper-buttons'>
                <Button className="generic-button" sx={{marginBlockStart: '3vh', color: 'white', marginInlineEnd: 'auto'}} onClick={decrementStep}>Previous</Button>
                <InternalSubmitButtonComponent label={"Next"} />
            </div>
        </InternalFormComponent>
    )
}