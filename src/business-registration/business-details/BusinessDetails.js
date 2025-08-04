import './business-details.css'
import { useState } from "react";
import {InternalInputFieldComponent, InternalFormComponent, InternalSelectFieldComponent, InternalListFieldComponent, InternalSubmitButtonComponent, InternalValidationErrorsComponent} from "../form-utils/form-components"

export default function BusinessDetails({ formData, setFormData, schema, incrementStep, businessTypes }) {

    return (
        <div>
            <InternalFormComponent formData={formData} setFormData={setFormData} schema={schema} onSubmit={incrementStep}>
                <fieldset>
                    <InternalInputFieldComponent name='businessName' displayName='Business Name'/>
                    <InternalSelectFieldComponent
                        name='businessType'
                        displayName='Business Type'
                        options={businessTypes.map(it => {return {value: it, label: it}})}
                        multiple={true}
                    />
                    <InternalInputFieldComponent name="address" displayName="Address"/>
                    <InternalInputFieldComponent name="city" displayName="City"/>
                    <InternalInputFieldComponent name="state" displayName="State"/>
                    <InternalInputFieldComponent name="website" displayName="Website"/>
                    <fieldset>
                    <InternalListFieldComponent
                        name="contacts"
                        displayName={"Contacts"}
                        defaultValue={{ key: '', value: '' }}
                        itemComponent={({it, idx, setFormData, errors, validatingFields, validateSubSchema}) =>
                            <>
                                <div key={idx} style={{ display: "flex", width: '100%', marginBlock: '0.1vh' }}>
                                    <InternalSelectFieldComponent
                                        className="form-label"
                                        name={'key'}
                                        label={false}
                                        showErrors={false}
                                        path={['contacts', idx]}
                                        validationDeps={['value']}
                                        options={[
                                            {value: 'mobile', label: 'Mobile'},
                                            {value: 'email', label: 'E-mail'},
                                            {value: 'phone', label: 'Phone'}
                                        ]}
                                    />
                                    <div className="form-input">
                                        <InternalInputFieldComponent
                                            name={'value'}
                                            label={false}
                                            showErrors={false}
                                            path={['contacts', idx]}
                                            validationDeps={['key']}
                                        />
                                    </div>
                                </div>
                                <div className="form-error">
                                    {errors[`contacts[${idx}].key`] ?
                                        <InternalValidationErrorsComponent
                                            path={['contacts', idx, 'key']}
                                        />
                                        : <InternalValidationErrorsComponent
                                            path={['contacts', idx, 'value']}
                                        />
                                    }                                    
                                </div>
                            </>
                        }
                    />
                    </fieldset>
                    
                </fieldset>

                <div className='stepper-buttons'>
                    <InternalSubmitButtonComponent label={"Next"}/>
                </div>
            </InternalFormComponent>
        </div>
    )
}