import "./Header.css"
import logo from "../../assets/icons/icon-f.png"

const Header = () => {
    return (
        <div className="header">
            <div className="logo-div">
                <img src={logo} className="logo" />
            </div>
            {/* <div className="title">
                <h1 className="main-title"> TastyPlan </h1>
                <p className="subtitle"> Discover recipes, plan your meals, and build your grocery list.</p>
            </div> */}
            <div className="mode">
                mode
            </div>
        </div>
    );

}
export default Header;