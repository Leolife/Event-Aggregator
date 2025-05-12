import './Header.css'

const Header = ({ title, sidebar, children}) => {

    return (
        <div className={`header-container ${sidebar ? "" : 'large-header-container'}`}>
            <div className="header">
                <h1> {title} </h1>
                {children}
            </div>
        </div>
    )
}

export default Header
