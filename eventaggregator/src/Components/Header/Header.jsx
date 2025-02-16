import React, { useState, useEffect } from 'react'
import { ReactComponent as SearchIcon } from '../../assets/search-icon.svg';
import './Header.css'

const Header = ({ title, sidebar, sendData, options }) => {
    // Whether the dropdown is active or not
    const [isActive, setActive] = useState(false);
    // Holds the category tag search query 
    const [query, setQuery] = useState("");
    // Stores the categories tags fetched from the API 
    const [categories, setCategories] = useState([{}]);
    // Stores the index of the tag 
    const [nextId, setNextId] = useState(0);
    // Stores the tag the user has selected
    const [selectedTags, setSelectedTags] = useState([]);
    // Stores the Sort By option the user has selected
    const [selectedSort, setSelectedSort] = useState(0);


    // Fetches the tags from the API
    useEffect(() => {
        fetch("/tags").then(
            res => res.json()
        ).then(
            categories => {
                setCategories(categories)
            }
        )
    }, [])

    // Sends the selected tags to the respective components 
    useEffect(() => {
        sendData(selectedTags, selectedSort);
    }, [selectedTags, selectedSort, sendData])

    return (
        <div className={`header-container ${sidebar ? "" : 'large-header-container'}`}>
            <div className="header">
                <h1> {title} </h1>
                <div className="filters">
                    <div className="category">
                        <div className="dropdown-search">
                            <div className="search-box flex-div">
                                <SearchIcon className="search-icon" />
                                {/* Displays dropdown menu when the search bar is focused 
                                Filters dropdown menu based on search query*/}
                                <input type="text" placeholder='Search Category Tags'
                                    onFocus={() => setActive(true)}
                                    onBlur={() => setActive(false)}
                                    onChange={e => setQuery(e.target.value)}
                                />
                            </div>
                            {isActive &&
                                <div className="dropdown-content" >
                                    <ul>
                                        {/* Adds tags to the category filter, limited to 3 tags */}
                                        {categories.filter(category =>
                                            category.toLowerCase().includes(query.toLowerCase()) &&
                                            !selectedTags.some(tag => tag.category === category)).map((category, index) => (
                                                <li key={index} className="dropdown-item" onMouseDown={() => {
                                                    if (selectedTags.length < 3) {
                                                        setNextId(prevId => prevId + 1)
                                                        setSelectedTags([
                                                            ...selectedTags,
                                                            { id: nextId, category: category }
                                                        ]);
                                                    }
                                                }}>
                                                    {category}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="tag-box">
                        {/* Removes tag from the filter when they are clicked on */}
                        {selectedTags.map((tag) => (
                            <div key={tag.id} className="tag">
                                <label className="tag-name" onClick={() => {
                                    setSelectedTags(
                                        selectedTags.filter(e =>
                                            e.id !== tag.id
                                        )
                                    )
                                }}> {tag.category} ˣ </label>
                            </div>
                        ))}
                    </div>
                    {/* Unique sort by dropdown */}
                    <div className="relevance">
                        <div className="dropdown-sort">
                            <label> Sort By: </label>
                            <select className="sortby" onChange={(e) => setSelectedSort(Number(e.target.value))}>
                                {/* Display the dropdown options sent from the header */}
                                {options.map((option, index) => (
                                    <option key={index} value={index}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
