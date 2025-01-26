import React from 'react';
import './Forum.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Forum_post from '../../Components/Forum_post/Forum_post';
/* 
*  below this comment is the temporary use of the imported image to fill the thumbnail
*  until we incorporate the posting functionality where the user can choose the thumbnail
*  then we can just load it in from the database (remove this comment once implemented)
*/
import thumbnail1 from '../../assets/thumbnail1.png';


export const Forum = ({ sidebar }) => {
    // Example post data - replace with the database data once that is set up then remove this comment please :)
    const posts = [  // the info used in this 'posts' array is used to fill in the Forum_post component
        {
            event: "YFP VS Fly Quest",
            title: "Recap discussion of the League match last night. I can't believe theBausffs man! Why would he do that?",
            preview: "What an intense match! The teamfight at Baron really turned things around. I noticed theBausffs goofing " + 
            "off in the top lane seemingly tricking the enemy team in his own match even though he was supposed to be casting " +
            "this game for Fly Quest, they must be very annoyed at him. Was he sponsored? If so he is most-definitely losing " +
            "the sponsorship or at least they are going to reprimand him somehow, that is just irrespopnsible to be honest. He " +
            "probably made so much money just for him to not even pay attention, like wow.",
            author: "TheLegend27",
            timestamp: "50 mins ago",
            upvotes: 7,
            downvotes: 1,
            replies: 7,
            thumbnail: thumbnail1
        }
    ];

    return(
        <>
          <Sidebar sidebar={sidebar} />
          <div className={`container ${sidebar ? "" : 'large-container'}`}>
            <div className="forum-feed">
                <h1>Recommended</h1>
                {posts.map((post, index) => (
                    <Forum_post key={index} {...post} />
                ))}
            </div>
          </div>
        </>
    )
}

export default Forum;
