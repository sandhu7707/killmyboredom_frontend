import { object, string, array, number } from 'yup'
import { api_check_username } from '../../utils/constants';

const checkIfUsernameAlreadyExists = async (username) => {
    if(username.length <= 3){
        return true;
    }

    let url = new URL(`${process.env.REACT_APP_BACKEND_URL}${api_check_username}`)
    url.searchParams.set('username', username)

    return fetch(url.toString())
        .then(result => result.json())
        .then(json => json.available)
        .catch(err => console.error(err))
}

export const signInSchema = object({
    username: string().min(3, 'Username must be at least 3 characters').required(),
    password: string().min(3, 'Password must be at least 3 characters').required('Required Field')
})
export const profileDetailsSchema = object({
    username: string().min(3, 'Username must be at least 3 characters').test(
        'already-exists',
        () => `Username already exists`,
        checkIfUsernameAlreadyExists
    ).required('Required Field'),
    password: string().min(3, 'Password must be at least 3 characters').required('Required Field'),
    confirmPassword: string().when('password', ([password]) => {
        return string().matches(`^${password}$`, 'Password and Confirm Password field must match').required('Required Field')
    }),
    email: string().matches(/[^@]*[@][^@]*[.]\w{2,6}/, 'Please enter a valid email').nullable().transform((value) => (value === '' ? null : value)),
    phone: number().min(1000000000, 'Mobile number has to be 10 digits').max(9999999999, 'Mobile number has to be 10 digits').nullable().transform((value) => (value === '' || !value ? null : value))
}).test('global', 'At least one of the email or phone number must be present', (value) => {
    return value.email || value.phone
})

export const businessDetailsSchema = object({
    businessName: string().min(3, 'Business Name must be at least 3 characters').required('Required Field'),
    businessType: array(string().min(3, 'Business Type must be at least 3 characters')).min(1, 'At least one business type is required').required('Required Field'),
    address: string().min(3, 'Address must be at least 3 characters'),
    city: string().min(3, 'City must be at least 3 characters').required('Required Field'),
    state: string().min(3, 'State must be at least 3 characters').required('Required Field'),
    contacts: array(object({
        key: string().min(3, "Contact key must be at least 3 characters").required('Please choose a Contact type'),
        value: string().min(3, "Contact value must be at least 3 characters").when('key', ([key]) => {
            switch (key) {
                case 'mobile': return number().positive().min(Math.pow(10, 9), "Mobile number should be at least 10 digits").max(Math.pow(10, 12) - 1, "Mobile number cannot be more than 12 digits").typeError('Mobile number has to be a numeric value').required('Required Field')
                case 'email': return string().matches(/[^@]*[@][^@]*[.]\w{2,6}/, 'Please enter a valid email').required('Required Field')
                case 'phone': return number().positive().min(Math.pow(10, 8), "Phone number has to be at least 9 digits").max(Math.pow(10, 14) - 1, "Phone number cannot be more than 14 digits").typeError('phone number has to be a numeric value').required('Required Field')
                default: console.error('unrecognized value in contacts key')            }
        }).required('Required Field')
    })).min(1).required('Required Field'),
    website: string().matches(/([h][t][t][p][s]?:[/][/].+)?[.]\w{2,6}[/]?.*/, 'Please enter a valid Website')
})

export const gymServiceSchema = object({
    gymService: object({
        timeSlots: array(object({
            timeSlots: array(object().shape({
                start: object().required('Required Field'),
                end: object().required('Required Field')
            })).min(1, 'At least one time slot is required').required('Required Field'),
            weekdays: array(string()).min(1, "At least one weekday is required to set timeslots for.").max(7)
        })).min(1, "Please add opening times.").max(7).required(),
        basicFee: array(
            object({
                timePeriodInMonths: number().min(1, 'Must at least be 1').max(12, 'Must be less than 12').required('Please specify time frame for this plan'),
                amount: number().positive().required('Please specify the cost/fee for this plan')
            })
        ),
        addOns: array(
            object({
                name: string().required('Name is required for add on'),
                fee: array(
                    object({
                        timePeriodInMonths: number().min(1, 'Must at least be 1').max(12, 'Must be less than 12').required('Please specify time frame for this plan'),
                        amount: number().positive().required('Please specify the cost/fee for this plan')
                    })
                ).min(1, 'At least one fee plan is required').required('At least one fee plan is required'),
            })
        )
    }).required()
})

export const coachingServiceSchema = object({
    coachingElements: array(
        object({
            name: string().required('Please name this element'),
            description: string(),
            timeSlots: array(object({
                timeSlots: array(object().shape({
                    start: object().required('Required Field'),
                    end: object().required('Required Field')
                })).min(1, 'At least one time slot is required').required('Required Field'),
                weekdays: array(string()).min(1, "At least one weekday is required to set timeslots for.").max(7)
            })).min(1, "Please add opening times.").max(7).required(),
            basicFee: array(
                object({
                    timePeriodInMonths: number().min(1, 'Must at least be 1').max(12, 'Must be less than 12').required('Please specify time frame for this plan'),
                    amount: number().positive().required('Please specify the cost/fee for this plan')
                })
            ),
            addOns: array(
                object({
                    name: string().required('Name is required for add on'),
                    fee: array(
                        object({
                            timePeriodInMonths: number().min(1, 'Must at least be 1').max(12, 'Must be less than 12').required('Please specify time frame for this plan'),
                            amount: number().min(0).required('Please specify the cost/fee for this plan')
                        })
                    ).min(1, 'At least one fee plan is required'),
                })
            )
        })
    )
})

export const eventsSchema = object({
    events: array(
        object({
            name: string().min(3).required('Please name this element'),
            description: string().min(3).required('Please add a description of the event'),
            timeRange: object().shape({
                    start: object().required('Required Field'),
                    end: object().required('Required Field')
                }).required('Please specify the time for event.'),
            basicFee:  number().min(0).required('Please specify the cost/fee'),
            addOns: array(
                object({
                    name: string().required('Name is required for add on'),
                    fee: number().min(0).required('Please specify the cost/fee').typeError('Please specify the cost/fee')
                })
            )
        })
    )
})

export const locationSchema = object({
    location: object({
        lat: number().required(),
        lng: number().required()
    }).required()
})
