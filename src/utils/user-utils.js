import { createContext } from "react";

export const UserContext = createContext({})

export function setUserDetails(json){
    if(json.user){
        window.localStorage.setItem('user', JSON.stringify(json.user))
    }
    if(json.token){
        window.localStorage.setItem('jwt-token', json.token)
    }
}

export function getUserDetails(){
    return JSON.parse(window.localStorage.getItem('user'))
}

export function removeUserDetails(){
    window.localStorage.removeItem('user')
    window.localStorage.removeItem('jwt-token')
}

export function addToken(json){
    return {...json, token: window.localStorage.getItem('jwt-token')}
}

export function getToken(){
    return window.localStorage.getItem('jwt-token')
}