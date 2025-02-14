import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
/* 
*  below this comment is the temporary use of the imported image to fill the thumbnail
*  until we incorporate the posting functionality where the user can choose the thumbnail
*  then we can just load it in from the database (remove this comment once implemented)
*/
import thumbnail1 from '../../assets/thumbnail1.png';

export const forumPosts = [
    {
        postId: 0,
        eventName: "League LAN party at ya motha's house",
        title: "We need to do this again guys, wasn't it fun?",
        body: "Man it was so fun, you guys are straight garbo ngl. But i appreciate the games and it was fun nonetheless!! much love <3",
        ownerName: "Pompompurin",
        timestamp: 120,
        upvoteCount: 4,
        downvoteCount: -31,
        replyCount: 22,
        thumbnailID: thumbnail1
    },
    {
        postId: 1,
        eventName: "YFP VS Fly Quest",
        title: "Recap discussion of the League match last night. I can't believe theBausffs man! Why would he do that?",
        body: "What an intense match! The teamfight at Baron really turned things around. I noticed theBausffs goofing " + 
        "off in the top lane seemingly tricking the enemy team in his own match even though he was supposed to be casting " +
        "this game for Fly Quest, they must be very annoyed at him. Was he sponsored? If so he is most-definitely losing " +
        "the sponsorship or at least they are going to reprimand him somehow, that is just irrespopnsible to be honest. He " +
        "probably made so much money just for him to not even pay attention, like wow.",
        ownerName: "TheLegend27",
        timestamp: 50,
        upvoteCount: 7,
        downvoteCount: 1,
        replyCount: 7,
        thumbnailID: thumbnail1
    }
];

export const Forum = () => {

    const navigate = useNavigate();

    useEffect(() => {
        // redirect if exactly at /forum
        if (window.location.pathname === '/Forum') {
            navigate('/forum/recommended');
        }
    }, [navigate]);
    
    return <Outlet />;
}

export default Forum;
