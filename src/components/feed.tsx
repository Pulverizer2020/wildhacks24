import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc, getDocs, addDoc, collection } from "firebase/firestore";
import { nanoid } from 'nanoid';

const db = getFirestore();

function Feed() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const postsCollection = collection(db, "posts");
            const postDocs = await getDocs(postsCollection);
            const posts = postDocs.docs.map(doc => doc.data());


            // Sort posts from most recent to oldest
            posts.sort((a, b) => new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime());


            setPosts(posts);
        };

        fetchPosts();
    }, []);

    const handleNewPost = async () => {
        const postID = nanoid(); // Generate a unique ID for the post
        const postDocRef = doc(db, "posts", postID);

        const postData = {
            title: "Post Title",
            userName: "John Doe",
            posterProfilePic: "https://lh3.googleusercontent.com/a/ACg8ocLz81nU89xDq87FXXZULYSf2POx1XT3VDgxKIw7dbU-Fi4TCMo=s96-c",
            description: "Post Description",
            specialUrl: "http://example.com",
            posterUid: "User123",
            postedTime: new Date().toISOString(),
            likes: 0,
            comments: [],
        };

        await setDoc(postDocRef, postData)
            .then(() => console.log("Post successfully created!"))
            .catch((error) => console.error("Error creating post: ", error));
    };

    return (
        <div className="pt-20 flex flex-col min-h-screen justify-center items-center">
            <p>Hi this is the Feed page</p>
            <img src="https://i.ibb.co/7SXf4ch/Screenshot-2024-04-07-011617.png" alt="Feed" className="w-10 h-10" />
            <button onClick={handleNewPost}>Create New Post</button>
            {posts.map((post, index) => (
                <div key={index} className="rounded overflow-hidden border w-full lg:w-4/12 md:w-6/12 bg-black mx-3 md:mx-0 lg:mx-0 mb-4">
                    <div className="w-full flex justify-between p-3">
                        <div className="flex">
                            <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
                                <img src={post.posterProfilePic} alt="profilepic"></img>
                            </div>
                            <span className="pt-1 ml-2 font-bold text-sm">
                                {post.userName}
                            </span>
                        </div>
                        <span className="px-2 hover:bg-gray-300 cursor-pointer rounded"><i className="fas fa-ellipsis-h pt-2 text-lg"></i></span>
                    </div>
                    <img className="w-full bg-cover" src="https://3.bp.blogspot.com/-Chu20FDi9Ek/WoOD-ehQ29I/AAAAAAAAK7U/mc4CAiTYOY8VzOFzBKdR52aLRiyjqu0MwCLcBGAs/s1600/DSC04596%2B%25282%2529.JPG" ></img>
                    <div className="px-3 pb-2">
                        <div className="pt-2">
                            <i className="far fa-heart cursor-pointer"></i>
                            <span className="text-sm text-gray-400 font-medium">
                                {post.likes} likes, created at {post.postedTime}</span>
                        </div>
                        <div className="pt-1">
                            <div className="mb-2 text-sm">
                                <span className="font-medium mr-2">
                                    {post.posterUid}
                                </span>
                                {post.description}
                            </div>
                        </div>
                        <div className="text-sm mb-2 text-gray-400 cursor-pointer font-medium">View all 14 comments</div>
                        {/*
                            <div className="mb-2">
                                <div className="mb-2 text-sm">
                                    <span className="font-medium mr-2">razzle_dazzle</span> Dude! How cool! I went to New Zealand last summer and had a blast taking the tour! So much to see! Make sure you bring a good camera when you go!
                            </div>
                    </div>*/}
                    </div>
                </div>
            ))
            }
        </div >
    );
}

export default Feed;