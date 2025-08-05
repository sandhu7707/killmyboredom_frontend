import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { InternalFormComponent, InternalInputFieldComponent, InternalSubmitButtonComponent, InternalValidationErrorsComponent } from "../business-registration/form-utils/form-components";
import { profileDetailsSchema } from "../business-registration/form-validation-utils/form-schemas";
import Button from "@mui/joy/Button";
import { api_user } from "../utils/constants";
import { useNavigate } from "react-router";

export default function RegisterUser(){

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: ''
    })
    const navigate = useNavigate()

    function handleSave(){
        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_user}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userData: formData})
        }).then( result => {
            if(result.status === 200) {
                alert('User Registered.')
                navigate('/')
            }
            else if(result.status === 409){
                alert('Username already exists. please choose a different username')
            }
        })
        .catch(err => console.error(err))
    }

    return(
        <div>
            <InternalFormComponent formData={formData} setFormData={setFormData} schema={profileDetailsSchema} onSubmit={handleSave}>
                    <InternalInputFieldComponent name="username" displayName= "Username"/>
                    <InternalInputFieldComponent
                        name="password"
                        displayName="Password"
                        validationDeps={["confirmPassword"]}
                        endDecorator={<IconButton onClick={() => setShowPassword(showPassword => !showPassword)}>{showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}</IconButton>}
                        type={showPassword ? 'text' : 'password'}
                    />
                    <InternalInputFieldComponent name="confirmPassword" validationDeps={['password']} displayName="Confirm Password"/>
                    <InternalInputFieldComponent name="email" displayName={"E mail"}/>
                    <InternalInputFieldComponent name="phone" type="number" displayName={"Phone"}/>
                
                <InternalValidationErrorsComponent
                    name={"global"}
                />
                <InternalSubmitButtonComponent label={'Submit'} position={"left"}/>
            </InternalFormComponent>
        </div>
    )
}