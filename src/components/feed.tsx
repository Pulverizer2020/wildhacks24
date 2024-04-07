import heartIcon from '../assets/favorite.png'
import React, { useState, useEffect } from "react";
import {
    getFirestore,
    doc,
    getDocs,
    collection,
    updateDoc,
    Timestamp,
} from "firebase/firestore";

import { useAuth } from "../utils/authContext";
import Swal from "sweetalert2";

import Post from "./post";

export type PostType = {
    postId: string;
    mapId: string;
    username: string;
    comments: [];
    likes: string[]; // will be filled with userIds
    createdAt: Timestamp;
    profilePicUrl: string;
    title: string;
    description: string;
};

function Feed() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            const postsCollection = collection(db, "posts");
            const postDocs = await getDocs(postsCollection);
            const posts = postDocs.docs.map((doc) => ({
                ...doc.data(),
                postId: doc.id,
            }));
            console.log("posts", posts);

            // Sort posts from most recent to oldest
            posts.sort(
                (a, b) =>
                    new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
            );

            setPosts(posts);
        };

        fetchPosts();
    }, []);

    const db = getFirestore();

    const handleLikeClick = (index: number, postId: string) => {
        if (!currentUser) {
            Swal.fire({
                icon: "info",
                title: "You need to log in to user this feature!",
            });
            return;
        }

        // like photo
        if (!posts[index].likes.includes(currentUser.uid)) {
            console.log("LIKING PHOTO");
            const postDocRef = doc(db, "posts", postId);
            const newLikes = [...posts[index].likes, currentUser.uid];
            updateDoc(postDocRef, {
                likes: newLikes,
            });
            setPosts((prevPosts) => {
                prevPosts[index].likes = newLikes;
                return [...prevPosts];
            });
        }

        // unlike photo
        else {
            console.log("UNLIKING PHOTO");
            const postDocRef = doc(db, "posts", postId);
            const indexOfMyLike = posts[index].likes.indexOf(currentUser.uid);
            const newLikes = posts[index].likes;
            newLikes.splice(indexOfMyLike, 1);
            updateDoc(postDocRef, {
                likes: newLikes,
            });
            setPosts((prevPosts) => {
                prevPosts[index].likes = newLikes;
                return [...prevPosts];
            });
        }
    };

    return (
        <div className="pt-20 flex flex-col min-h-screen justify-center items-center">
            {posts.map((post, index) => (
                <Post post={post} index={index} handleLikeClick={handleLikeClick} showComments={handleShowComments} />
            ))}
        </div>
    );
}

export default Feed;
