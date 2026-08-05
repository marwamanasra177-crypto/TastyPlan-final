import "./Header.css"
import logo from "../../assets/icons/icon-fm.png"
import lightModeIcon from "../../assets/icons/Sun.png"
import darkModeIcon from "../../assets/icons/Sun-dark.png"
import { useTheme } from "../Context/Context";
const Header = () => {
  const { theme, toggleTheme } = useTheme();

    return (
        <div className="header">
            <div className="logo-div">
                <img src={logo} className="logo" />
            </div>
            <div className="mode">
                <img src={theme === "dark" ? lightModeIcon : darkModeIcon} className="mode-icon" onClick={toggleTheme} />
                 

            </div>
        </div>
    );

}
export default Header;