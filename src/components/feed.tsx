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
            title: "Replanning my Street",
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
                <div key={index} className="rounded overflow-hidden border w-full lg:w-4/12 md:w-6/12 bg-white text-gray-900 mx-3 md:mx-0 lg:mx-0 mb-4">
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
                        <div className="flex justify-between items-center">
                            <button class="inline-flex items-center px-1 pt-2 ml-1 flex-column">
                                <svg class="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"
                                    viewBox="0 0 95 78" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M29.58 0c1.53.064 2.88 1.47 2.879 3v11.31c19.841.769 34.384 8.902 41.247 20.464 7.212 12.15 5.505 27.83-6.384 40.273-.987 1.088-2.82 1.274-4.005.405-1.186-.868-1.559-2.67-.814-3.936 4.986-9.075 2.985-18.092-3.13-24.214-5.775-5.78-15.377-8.782-26.914-5.53V53.99c-.01 1.167-.769 2.294-1.848 2.744-1.08.45-2.416.195-3.253-.62L.85 30.119c-1.146-1.124-1.131-3.205.032-4.312L27.389.812c.703-.579 1.49-.703 2.19-.812zm-3.13 9.935L7.297 27.994l19.153 18.84v-7.342c-.002-1.244.856-2.442 2.034-2.844 14.307-4.882 27.323-1.394 35.145 6.437 3.985 3.989 6.581 9.143 7.355 14.715 2.14-6.959 1.157-13.902-2.441-19.964-5.89-9.92-19.251-17.684-39.089-17.684-1.573 0-3.004-1.429-3.004-3V9.936z"
                                        fill-rule="nonzero" />
                                </svg>
                            </button>
                            <button class="inline-flex items-center px-1 -ml-1 flex-column">
                                <svg class="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-700" fill="none"
                                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div className="pt-2">
                            <i className="far fa-heart cursor-pointer"></i>
                            <span className="text-sm text-gray-500 font-medium">
                                {post.likes} likes, created at {post.postedTime}</span>
                        </div>
                        <div className="pt-1">
                            <div className="mb-2 text-sm">
                                <span className="font-medium mr-2">
                                    {post.userName}
                                </span>
                                {post.description}
                            </div>
                        </div>
                        <div className="text-sm mb-2 text-gray-500 cursor-pointer font-medium">View all 14 comments</div>
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