import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();


export const AppProvider = ({children}) => {

    {/*console.log("Axios base URL:", axios.defaults.baseURL);*/} // added console.log to check base URL
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY
    const [token,setToken] = useState(null)
    const [user,setUser] = useState(null)
    const [isOwner,setIsOwner] = useState(false)
    const [showLogin,setShowLogin] = useState(false)
    const [pickupDate,setPickupDate] = useState('')
    const [returnDate,setReturnDate] = useState('')
    const [cars,setCars] = useState([])

    //function to check if user is logged in
    const fetchUser = async () => {
        try {
            const {data} = await axios.get('/api/user/data')
            if(data.success){
                setUser(data.user)
                setIsOwner(data.user.role==='owner')
            }else{
                navigate('/')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to fetch all cars from the server

    const fetchCars = async () => {
        try {
            const {data} = await axios.get('/api/user/cars')
            if(data.success){
                setCars(data.cars)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to logout the user
    const logout=()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization'] = ''
        toast.success('Logged out successfully')
    }

    //useEffect to retrieve the token from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token')
        setToken(token)
    },[])

    useEffect(() => {
        if(token){
            axios.defaults.headers.common['Authorization'] = `${token}`
            fetchUser()
            fetchCars()
        }
    },[token])

    const value = {
        navigate,currency,axios,user,setUser,token,setToken,isOwner,setIsOwner,fetchUser,showLogin,setShowLogin,logout,fetchCars,cars,setCars,pickupDate,setPickupDate,returnDate,setReturnDate
    }
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if(!context){
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}