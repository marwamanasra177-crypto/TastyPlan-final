import "./Header.css";

import logo from "../../assets/icons/icon-fm.png";
import lightModeIcon from "../../assets/icons/Sun.png";
import darkModeIcon from "../../assets/icons/Sun-dark.png";

import { useTheme } from "../Context/Context";

import { Link } from "react-router-dom";

const Header = () => {

    const {
        theme,
        toggleTheme
    } = useTheme();

    return (

        <header className="header">

            <div className="logo-div">

                <Link to="/">
                    <img
                        src={logo}
                        className="logo"
                        alt="TastyPlan"
                    />
                </Link>

            </div>

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

            </nav>

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

        </header>

    );
};

export default Header;