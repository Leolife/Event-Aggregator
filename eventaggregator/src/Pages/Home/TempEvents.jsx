
/* 
*  below this comment is the temporary use of the imported image to fill the thumbnail
*  until we incorporate the posting functionality where the user can choose the thumbnail
*  then we can just load it in from the database (remove this comment once implemented)
*/
import thumbnail1 from '../../assets/thumbnail1.png';
import thumbnail2 from '../../assets/thumbnail2.jpg'
import thumbnail3 from '../../assets/thumbnail3.png'
import thumbnail4 from '../../assets/thumbnail4.jpg'
import thumbnail5 from '../../assets/thumbnail5.png'
import thumbnail6 from '../../assets/thumbnail6.png'
import thumbnail7 from '../../assets/thumbnail7.jpg'
import thumbnail8 from '../../assets/thumbnail8.png'
import thumbnail9 from '../../assets/thumbnail9.jpg'
import thumbnail10 from '../../assets/thumbnail10.png'
import thumbnail11 from '../../assets/thumbnail11.jpg'
import thumbnail12 from '../../assets/thumbnail12.png'

export const eventInfo = [
    {
        name: "League of Legends",
        thumbnail: thumbnail1,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["RPG", "Strategy"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Marvel Rivals",
        thumbnail: thumbnail2,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Shooter", "Action"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Music",
        thumbnail: thumbnail3,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["IRL"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Super Smash Brothers Ultimate",
        thumbnail: thumbnail4,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Fighting", "Platformer"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Sports",
        thumbnail: thumbnail5,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["IRL"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Valorant",
        thumbnail: thumbnail6,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Shooter", "FPS", "Action"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "VR Chat",
        thumbnail: thumbnail7,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Simulation"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Hololive",
        thumbnail: thumbnail8,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["VTuber"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Osu!",
        thumbnail: thumbnail9,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Rhythm & Music Game"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Magic: The Gathering",
        thumbnail: thumbnail10,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Tabletop"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "Pokemon TCG",
        thumbnail: thumbnail11,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Tabletop"],
        link: 'event/category/league-of-legends'
    },
    {
        name: "One Piece TCG",
        thumbnail: thumbnail12,
        total_events: Math.floor(Math.random() * 20) + 1,
        total_upcomming: Math.floor(Math.random() * 5) + 1,
        tags: ["Tabletop"],
        link: 'event/category/league-of-legends'
    },
    

];
