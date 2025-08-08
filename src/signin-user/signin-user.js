import { InternalFormComponent, InternalInputFieldComponent, InternalSubmitButtonComponent } from "../business-registration/form-utils/form-components"
import { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Button from "@mui/joy/Button";
import { api_sign_in } from "../utils/constants";
import { setUserDetails, UserContext } from "../utils/user-utils";
import { useNavigate, useSearchParams } from "react-router";
import { signInSchema } from "../business-registration/form-validation-utils/form-schemas";
import "./signin-user.css"

export default function SignInUser({lightFonts=false}){

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    const redirectTo = useSearchParams()[0].get("redirectTo")
    console.log(redirectTo)
    const {setUser} = useContext(UserContext)
    const navigate = useNavigate()

    function handleSubmit () {
        fetch(`${process.env.REACT_APP_BACKEND_URL}${api_sign_in}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userData: formData
            })
        }).then(result => {
            if(result.status === 200){
                return result.json()
            }
            else if(result.status === 403){
                alert('Incorrect credentials. Please try again')
            }
            else{
                alert('Error Signing In. Please contact administrator or try again later')
            }
        })
        .then(json => {
            setUser(json.user)
            setUserDetails(json)
            if(redirectTo){
                navigate(redirectTo)
            }
            else{
                navigate('/')
            }
        })
        .catch(err => console.error(err))
    }

    let fontColor = lightFonts ? 'white' : 'black'

    return <div>
        <InternalFormComponent
         style={{width: '100%', marginInline:'auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
         schema={signInSchema}
         formData={formData} 
         setFormData={setFormData} 
         onSubmit={handleSubmit}>
            <InternalInputFieldComponent
                sx={{backgroundColor: 'rgb(0,0,0,0)', color: fontColor, borderTop: '0', borderInline: '0', borderRadius: '0', marginBlockStart: '2vh'}}
                name='username'
                placeholder={'Username'}
                label={false}
            />
            <InternalInputFieldComponent
                sx={{backgroundColor: 'rgb(0,0,0,0)', color: fontColor, borderTop: '0', borderInline: '0', borderRadius: '0', marginBlockStart: '2vh'}}
                name='password'
                placeholder={'Password'}
                label={false}
                endDecorator={<IconButton onClick={() => setShowPassword(showPassword => !showPassword)}>{showPassword ? <MdOutlineVisibilityOff color={fontColor} /> : <MdOutlineVisibility color={fontColor}/>}</IconButton>}
                type={showPassword ? 'text' : 'password'}
            />
            <InternalSubmitButtonComponent label={'Sign In'} position="left"/>
            <p style={{color: fontColor, marginLeft: 'auto'}}><a style={{color: fontColor}} href="/register-user">Create a new Account</a></p>
            
        </InternalFormComponent>
    </div>
}