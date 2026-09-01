import "./SearchBar.css";
import searchicon from "../../assets/icons/search_8478650.png"
import { useEffect, useRef } from "react";
 
interface SearchBarprops{
    setSearch : (value :string) => void;
} 

const SearchBar = ({setSearch} : SearchBarprops) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleShortcut = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key == "k")
                event.preventDefault();
            inputRef.current?.focus();
        };
        window.addEventListener(
            "keydown", handleShortcut
        );
        return () => {
            window.removeEventListener(
                "keydown", handleShortcut
            ) ;
            ;
        };
    }, [])

    return (
        <div className="search-header">
                <div className="searchbar">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for a recipe..."
                        className="search-input"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <img src={searchicon} className="search-icon" />

                </div>
            </div>


    )
}
export default SearchBar 


// import "./SearchBar.css";
// import searchicon from "../../assets/icons/search_8478650.png"
// import { useEffect, useRef } from "react";

// interface SearchBarProps 
// {
//     setSearch: (value: string) => void;
// }

//  function SearchBar({ setSearch }: SearchBarProps) {
//         const inputRef = useRef<HTMLInputElement>(null);

//         useEffect(() => {
//             const handleShortcut = (event: KeyboardEvent) => {
//                 if ((event.ctrlKey || event.metaKey) && event.key === "k") {
//                     event.preventDefault();
//                     inputRef.current?.focus();
//                 }
//             };
//             window.addEventListener(
//                 "keydown",
//                 handleShortcut
//             );
//             return () => {
//                 window.removeEventListener(
//                     "keydown",
//                     handleShortcut
//                 );
//             };
//         }, []);

//         return (
//             <div className="search-header">
//                 <div className="searchbar">
//                     <input
//                         ref={inputRef}
//                         type="text"
//                         placeholder="Search for a recipe..."
//                         className="search-input"
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                     <img src={searchicon} className="search-icon" />

//                 </div>
//             </div>
//         );
// }

// export default SearchBar;