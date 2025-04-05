import Sidebar from '../../Components/Sidebar/Sidebar';

export const Friends = ({ sidebar }) => {

    return (
        <>
            <Sidebar sidebar={sidebar} />
            <div className={`container ${sidebar ? "" : 'large-container'}`}></div>
        </>
        )
};