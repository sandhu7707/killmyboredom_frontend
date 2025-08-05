import { useState } from "react";
import { object, reach } from "yup";

export default function useValidateSubSchema(schema){

    const [errors, setErrors] = useState({});
    const [validatingFields, setValidatingFields] = useState([])

    const clearValidatingFields = (key) => {
        setValidatingFields(validatingFields => {
            validatingFields.splice(validatingFields.findIndex(it => it === key), 1)
            return [...validatingFields]
        })
    }

    const validateSubSchema = (obj, schemaKey, parentPath='', dependencies) => {

        if(!schema){
            return
        }

        let dependenciesSchema = {};
        let dependenciesValues = {}
        console.log("parentPath: ", parentPath)
        console.log("schemaKey: ", schemaKey)
        try {
            reach(schema, parentPath ? parentPath+'.'+schemaKey : schemaKey)
            if(dependencies && Object.keys(dependencies).length > 0){
                Object.keys(dependencies).forEach(key => {
                    dependenciesSchema[key] = reach(schema, parentPath+key)
                    dependenciesValues[key] = dependencies[key]
                });
            }
        }
        catch (err) {
            console.log(err)
            return
        }     

        let path = schemaKey;

        let subSchema = reach(schema, parentPath+schemaKey)

        if (dependencies && Object.keys(dependencies).length > 0) {
            subSchema = object({
                [schemaKey]: subSchema,
                ...dependenciesSchema
            })

            obj = {
                [schemaKey]: obj,
                ...dependenciesValues
            }

            path = ''
        }

        if(parentPath !== '' && path !== '' && typeof path !== 'number'){
            parentPath += '.'
        }
        
        path = parentPath + path

        setValidatingFields(validatingFields => [...validatingFields, schemaKey])
        subSchema.validate(obj, { abortEarly: false })
            .then(data => {
                clearValidatingFields(schemaKey)
                setErrors(errors => {
                    for (let key of 
                        Object.keys(errors).filter(it => {
                            return (
                                it.startsWith(schemaKey) 
                                || (dependencies && Object.keys(dependencies).findIndex(d => it.startsWith(d)) > -1) 
                                || (path !== '' && it.startsWith(path))
                            )
                        })
                    ){
                        delete errors[key]
                    }

                    return { ...errors }
                })
            })
            .catch(err => {
                console.dir(err)
                clearValidatingFields(schemaKey)
                setErrors(errors => {
                    if(!errors){
                        return errors
                    }
                    for (let key of Object.keys(errors).filter(it => it.startsWith(schemaKey) || (dependencies && Object.keys(dependencies).findIndex(d => it.startsWith(d)) > -1) || (path !== '' && it.startsWith(path)))) {
                        delete errors[key]
                    }
                    let newErrors = {}
                    for (let error of err.inner) {
                        let currPath = path;
                        if(path !== '' && !error.path.startsWith('[') && error.path !== ''){
                            currPath += '.'
                        }
                        currPath += error.path
                        currPath = currPath === "" ? "global" : currPath
                        if (newErrors[currPath]) {
                            newErrors[currPath].push(error.message)
                        }
                        else {
                            newErrors[currPath] = [error.message]
                        }
                    }

                    return { ...errors, ...newErrors }
                })
            })
    }


    return [errors, validatingFields, validateSubSchema]

}