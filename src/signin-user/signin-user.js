import { InternalFormComponent, InternalInputFieldComponent } from "../business-registration/form-utils/form-components"
import { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import Button from "@mui/joy/Button";
import { api_sign_in } from "../utils/constants";
import { setUserDetails, UserContext } from "../utils/user-utils";
import { useNavigate } from "react-router";
import { signInSchema } from "../business-registration/form-validation-utils/form-schemas";

export default function SignInUser(){

    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

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
            navigate('/')
        })
        .catch(err => console.error(err))
    }

    return <>
        <InternalFormComponent
         style={{width: '50%', marginInline:'auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
         schema={signInSchema}
         formData={formData} 
         setFormData={setFormData} 
         onSubmit={handleSubmit}>
            <InternalInputFieldComponent
                sx={{backgroundColor: 'rgb(0,0,0,0)', color: 'white', borderTop: '0', borderInline: '0', borderRadius: '0'}}
                name='username'
                placeholder={'Username'}
                label={false}
            />
            <InternalInputFieldComponent
                sx={{backgroundColor: 'rgb(0,0,0,0)', color: 'white', borderTop: '0', borderInline: '0', borderRadius: '0', marginBlockStart: '2vh'}}
                name='password'
                placeholder={'Password'}
                label={false}
                endDecorator={<IconButton onClick={() => setShowPassword(showPassword => !showPassword)}>{showPassword ? <MdOutlineVisibilityOff color="white" /> : <MdOutlineVisibility color="white"/>}</IconButton>}
                type={showPassword ? 'text' : 'password'}
            />
            <Button variant="outline" sx={{marginBlockStart: '3vh', marginInlineEnd: 'auto', color: 'white'}} type="submit">Sign In</Button>
            <p style={{color: 'white', marginLeft: 'auto'}}><a style={{color: 'white'}} href="/register-user">Create a new Account</a></p>
            
        </InternalFormComponent>
    </>
}