import './Forum.css'
import Sidebar from '../../Components/Sidebar/Sidebar'


export const Forum = ({ sidebar }) => {
    return(
        <>
          <Sidebar sidebar={sidebar} />
          <div className={`container ${sidebar ? "" : 'large-container'}`}>
            <div className="forum-feed">
                <h1>Forum</h1>
            </div>
          </div>
        </>
    )



}
