import Typography from "@mui/joy/Typography";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import './nav-bar.css'
import { useContext } from "react";
import { removeUserDetails, UserContext } from "../utils/user-utils";
import { MdAccountCircle } from "react-icons/md";

export default function NavBar(props){

    let location = useLocation()
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()

    const signOut = () => {
        removeUserDetails()
        setUser(null)
    }

    let account = <div tabIndex={0} className="account-button">
        <MdAccountCircle style={{display: 'block', marginInlineStart: 'auto'}} />
        <div className="collapsible-account-options">
            <Typography onClick={() => {navigate('/registered-businesses'); window.location.reload()}} className="account-option">Registered Businesses</Typography>
            {/* <Typography onClick={() => navigate('/favorited-businesses')} className="account-option">Favorited Spots</Typography> */}
            {/* <Typography className="account-option">Account Options</Typography> */}
            <Typography className="account-option" onClick={signOut}>Sign Out</Typography>
        </div>
    </div>

    return (
        <>
            {location.pathname !== '/' &&
            <div className="navbar-container">
                <Link to="/" className="home-link"><Typography className="home-link-content">Kill Your Boredom</Typography></Link>
                {user && account}
            </div>
            }
            {location.pathname === '/' && user && account}
            <Outlet></Outlet>
        </>
    )
}