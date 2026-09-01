
import './Header.css'
import logo from '../../assets/icons/icon-fm.png'
import darkModeIcon from '../../assets/icons/light-1_Nero_AI_Image_Upscaler_Photo_Face_Nero_AI_Background_Remover_transparent.png'
import { useTheme } from "../Context/Context";
import { useAuth } from "../Context/AuthContext";
import lightModeIcon from '../../assets/icons/dark-1_Nero_AI_Image_Upscaler_Photo_Face_Nero_AI_Background_Remover_transparent.png'

import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const {theme,toggleTheme} = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };


    return (
        <div className="header">
            <div className='header-up'>
                <nav className="navigation">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/favorites">
                        Favorites
                    </Link>
                    
                    <Link to="/meal-plan">
                        Meal Plan
                    </Link>

                    <Link to="/grocery-list">
                        Grocery List
                    </Link>

                    {user ? (
                        <>
                            <span className="nav-username">
                                {user.name}
                            </span>
                            <button
                                type="button"
                                className="nav-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                Login
                            </Link>
                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}

                </nav>

            </div>
            <div className='header-down'>
                <div className="logo-div">

                    <Link to="/">
                        <img
                            src={logo}
                            className="logo"
                            alt="TastyPlan"
                        />
                    </Link>

                </div>



                <div className="mode">

                    <img
                    src={
                        theme === "dark"
                            ? lightModeIcon
                            : darkModeIcon
                    }
                    className="mode-icon"
                    onClick={toggleTheme}
                    alt="Toggle theme"
                />

                </div>

            </div>

        </div>

    )


}

export default Header 
















// import "./Header.css";

// import logo from "../../assets/icons/icon-fm.png";
// import lightModeIcon from "../../assets/icons/Sun.png";
// import darkModeIcon from "../../assets/icons/Sun-dark.png";

// import { useTheme } from "../Context/Context";

// import { Link } from "react-router-dom";

// const Header = () => {

//     const {
//         theme,
//         toggleTheme
//     } = useTheme();

//     return (

//         <header className="header">

//             <div className="logo-div">

//                 <Link to="/">
//                     <img
//                         src={logo}
//                         className="logo"
//                         alt="TastyPlan"
//                     />
//                 </Link>

//             </div>

//             <nav className="navigation">

//                 <Link to="/">
//                     Home
//                 </Link>

//                 <Link to="/favorites">
//                     Favorites
//                 </Link>

//                 <Link to="/meal-plan">
//                     Meal Plan
//                 </Link>

//                 <Link to="/grocery-list">
//                     Grocery List
//                 </Link>

//             </nav>

//             <div className="mode">

//                 <img
//                     src={
//                         theme === "dark"
//                             ? lightModeIcon
//                             : darkModeIcon
//                     }
//                     className="mode-icon"
//                     onClick={toggleTheme}
//                     alt="Toggle theme"
//                 />

//             </div>

//         </header>

//     );
// };

// export default Header;