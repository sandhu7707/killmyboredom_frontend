import useValidateSubSchema from "../form-validation-utils/validate-sub-schema";
import { createContext, useContext } from "react"
import Typography from "@mui/joy/Typography";
import Input from '@mui/joy/Input'
import CircularProgress from "@mui/material/CircularProgress"
import { MdAdd, MdInfoOutline, MdRemove } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import { number } from "yup";
import Select from "@mui/joy/Select";
import Chip from "@mui/joy/Chip";
import Option from '@mui/joy/Option'
import Button from "@mui/joy/Button";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Textarea from '@mui/joy/Textarea';
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import "./form-components.css"

const FormContext = createContext({})

export function InternalFormComponent({ formData, setFormData, schema, children, onSubmit, ...props }) {

    const [errors, validatingFields, validateSubSchema] = useValidateSubSchema(schema)

    const handleSubmit = async (e) => {
        e.preventDefault()
        validateSubSchema(formData, '')
        if (onSubmit) {
            onSubmit(e)
        }
    }

    return (
        <form className="form-container" onSubmit={handleSubmit} {...props}>
            <div className="form-content">
                <FormContext value={{ formData, setFormData, schema, errors, validatingFields, validateSubSchema }}>
                    {children}
                </FormContext>
            </div>
        </form>
    )
}

export function getValueAtPath(obj, path){
    let target = obj
    for(let k of path){
        target = target[k]
    }

    return target;
}

function setValueAtPath(obj, path, value){
    let target = obj
    for(let i=0; i<path.length; i++){
        if(i === path.length-1)
            target[path[i]] = value
        else{
            if(typeof path[i] === number){
                if(!Array.isArray(target)){
                    target = []
                }
            }
            target = target[path[i]]
        }
    }

    target = value
}

function getPathStringForSubSchema(_path){
    let path = [..._path]
    let result = path.shift()
    for(let k of path){
        if(typeof k === 'string'){
            result += '.' + k
        }
        else if(typeof k === 'number'){
            result += `[${k}]`
        }
    }

    return result
}

function validate(name, value, path, validationDeps, formData, validateSubSchema){
    
    try {
        let completePath = [...path, name]
        let parentPath = completePath.slice(0, completePath.length-1)
            
        let dependencies = {}
        if (validationDeps) {
            for (let dependencyKey of validationDeps) {
                dependencies[dependencyKey] = getValueAtPath(formData, [...parentPath, dependencyKey])
            }
        }
        validateSubSchema(value, name, getPathStringForSubSchema(parentPath), dependencies)
    }
    catch (err) {
        console.log(err)
    }
}

export function InternalInputFieldComponent({ name, value, displayName, validationDeps, showErrors=true, path = [], label=true, textarea=false, ...props }) {

    const { formData, setFormData, errors, validateSubSchema } = useContext(FormContext)

    let completePath = [...path, name]
    let pathSchemaString = getPathStringForSubSchema(completePath)
    let handleInputChange = (e) => {
        let value = e.target.value;
        setFormData(formData => { 
            let it = {...formData}
            setValueAtPath(it, completePath, value)
            return it 
        });

        validate(name, value, path, validationDeps, formData, validateSubSchema)
    }

    let input = textarea ? 
                <Textarea
                    error={errors[pathSchemaString] && errors[pathSchemaString].length > 0}
                    sx={{backgroundColor: 'rgb(0,0,0,0)', color: 'black', borderTop: '0', borderInline: '0', borderRadius: '0', marginBlockStart: '2vh'}}
                    value={getValueAtPath(formData, completePath)}
                    name={name}
                    id={name}
                    placeholder={displayName}
                    className="form-input"
                    onChange={handleInputChange}
                    minRows={1}
                    maxRows={3}
                    {...props}
                />
                :<Input
                    error={errors[pathSchemaString] && errors[pathSchemaString].length > 0}
                    sx={{backgroundColor: 'rgb(0,0,0,0)', color: 'black', borderTop: '0', borderInline: '0', borderRadius: '0', marginBlockStart: '2vh'}}
                    value={getValueAtPath(formData, completePath)}
                    name={name}
                    placeholder={displayName}
                    id={name}
                    className="form-input"
                    onChange={handleInputChange}
                    {...props}
                />

    return (
        <>
            {/* {label ? 
            <div className="input-container">
                <Typography className="form-label">{displayName}</Typography>
                {input}
            </div>
            : input} */}
            {input}
            {showErrors && <InternalValidationErrorsComponent
                path={path}
                name={name}
            />}
        </>
    )
}

export function InternalSelectFieldComponent({ name, displayName, options, validationDeps, label=true, showErrors=true, path=[], ...props}) {
    const { formData, setFormData, errors, validateSubSchema } = useContext(FormContext)
    
    let pathStringSchema = getPathStringForSubSchema([...path, name]);
    const handleChange = (e, newVal) => {
        setFormData(formData => {
            setValueAtPath(formData, [...path, name], newVal)
            return { ...formData}
        })

        validate(name, newVal, path, validationDeps, formData, validateSubSchema)
    }

    let select = <Select name={name} id={name} className="form-input"
                    placeholder={displayName}
                    sx={{backgroundColor: 'rgb(0,0,0,0)', color: 'black', borderTop: '0', borderInline: '0', borderRadius: '0', marginBlockStart: '2vh'}}
                    value={getValueAtPath(formData, [...path, name])}
                    color={errors[pathStringSchema] && errors[pathStringSchema].length > 0 ? 'danger' : 'neutral' }
                    renderValue={(selected) => {
                        if(!Array.isArray(selected)){
                            selected = [selected]
                        }
                        return selected.map(it => {
                            return <Chip key={it.label}>{it.label}</Chip>
                        })
                    }}
                    onChange={handleChange}
                    {...props}
                >
                    {options.map(it => <Option key={it.value} className="form-input" value={it.value}>{it.label}</Option>)}
                </Select>

    return (
        <>
            {/* {label ? <div className="input-container">
                <Typography className="form-label">{displayName}</Typography>
                {select}
            </div>
            : select} */}
            {select}
            {showErrors && <InternalValidationErrorsComponent
                path={path}
                name={name}
            />}
        </>
    )
}

export function InternalListFieldComponent({ label=true, name, displayName, itemComponent, defaultValue={}, path = [], validationDeps, disableAdd, disableRemove, showErrors=true, inlineListButtons=false }) {

    const { formData, setFormData, errors, validatingFields, validateSubSchema } = useContext(FormContext)

    let completePath = [...path, name]
    let items = getValueAtPath(formData, completePath)

    const buttons = <div style={{display: 'flex', justifyContent: 'center', flexBasis: inlineListButtons ? '30%' : '100%', flexShrink: 1}}>
        <IconButton
                    sx={{width: '5vh', height: '5vh', marginBlock: 'auto'}}
                    disabled={disableAdd}
                    onClick={
                        () => setFormData((formData) => {
                            let it = {...formData}
                            let oldValue = items ? items : []
                            let newValue = [...oldValue, defaultValue]
                            setValueAtPath(it, completePath, newValue)

                            validate(name, newValue, path, validationDeps, formData, validateSubSchema)
                            return it
                        })
                    }>
                    <MdAdd />
                </IconButton>
                <IconButton
                    sx={{width: '5vh', height: '5vh', marginBlock: 'auto'}}
                    disabled={disableRemove}
                    onClick={
                        () => setFormData((formData) => {
                            let it = {...formData}
                            let oldValue = items ? items : []
                            let newValue = oldValue.slice(0, oldValue.length-1)
                            setValueAtPath(it, completePath, newValue)
                            
                            validate(name, newValue, path, validationDeps, formData, validateSubSchema)
                            return it
                        })
                    }>
                    <MdRemove />
                </IconButton>
    </div>

    return (
        <>
            {label && <div className="input-container">
                <Typography className="form-label"><Box sx={{fontWeight: 800, width: '100%'}}>{displayName}</Box></Typography>
            </div>}
            <div className="input-container" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}}>
                {items && items.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 1, flexBasis: inlineListButtons ? '70%' : '100%', marginBlock: '2vh' }}> {/** TODO: flex-basis here not working!, doing flex-wrap for now - needed for mobile */}
                    {items.map((it, idx) => itemComponent({it, idx, formData, setFormData, errors, validatingFields, validateSubSchema}))}
                </div>}
                {inlineListButtons && buttons}                
            </div>
            {!inlineListButtons && buttons}
            {showErrors && <InternalValidationErrorsComponent
                path={path}
                name={name}
            />}
        </>
    )
}

export function InternalTimeRangeComponent({path, name, displayName, label=true}){

    const {formData, setFormData} = useContext(FormContext)

    const handleTimeSlotChange = (e, part) => {
    let parentPath = path
        setFormData(formData => {
            let p = formData;
            if(parentPath){
                for(let path of parentPath){
                    p = p[path]
                }
            }
            
            p[part] = e
            return { ...formData }
        })
    }

    let currStart = getValueAtPath(formData, path).start

    if(!(currStart instanceof dayjs)){
        handleTimeSlotChange(dayjs(currStart), 'start')
    }
    let currEnd = getValueAtPath(formData, path).end

    if(!(currEnd instanceof dayjs)){
        handleTimeSlotChange(dayjs(currEnd), 'end')
    }

    let timeRange = <div className="form-input" style={{ justifyContent: 'space-around', display: 'flex', flexWrap: 'wrap', color: 'black' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            key={`start`}
                            id={`${name}-start`}
                            sx={{ marginBlock: '1vh', color: 'black'}}
                            label="Start Time"
                            value={currStart instanceof dayjs ? currStart : dayjs(currStart)}
                            onChange={(e) => { handleTimeSlotChange(e, 'start') }}
                        />
                        <TimePicker
                            key={`end`}
                            id={`${name}-end`}
                            sx={{ marginBlock: '1vh', color: 'black'}}
                            label="End Time"
                            value={currEnd instanceof dayjs ? currEnd : dayjs(currEnd)}
                            onChange={(e) => { handleTimeSlotChange(e, 'end') }}
                        />
                    </LocalizationProvider>
                </div>
    return (
        <div className="">     
                {label ? <div className="input-container">
                    <Typography className="form-label" style={{color: 'black'}}>{displayName}</Typography>
                    {timeRange}
                </div>
                : timeRange
                }
                
        </div>
    )
}

export function InternalValidationErrorsComponent({path=[], name}) {
    
    const {errors, validatingFields} = useContext(FormContext)

    let pathStringSchema = getPathStringForSubSchema([...path, name]);
    return (
        <div className="form-error">
            {errors[pathStringSchema] && errors[pathStringSchema].map(it =>
                <li key={it} style={{ display: 'block' }}>
                    {it}<MdInfoOutline />
                </li> )}
            {validatingFields.find(it => it === pathStringSchema) && <CircularProgress></CircularProgress>}
        </div>
    )
}

export function InternalSubmitButtonComponent({label, position='right'}){

    const {errors} = useContext(FormContext)

    console.log(position)
    return (
        <Button
            className="generic-button"
            style={position === 'right' ? {marginInlineStart: 'auto'} : {marginInlineEnd: 'auto'}}
            sx={{marginBlockStart: '3vh', color: 'white', float: position}}
            disabled={Object.keys(errors).length !== 0} 
            type="submit"
        >{label}</Button>
    )
}