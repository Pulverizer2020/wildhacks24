import heartIcon from "../assets/favorite.png";
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
  comments: { username: string; profilePicUrl: string; comment: string }[];
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

  const handleSubmitComment = (
    postIndex: number,
    postId: string,
    comment: string
  ) => {
    if (!currentUser) {
      Swal.fire({
        icon: "info",
        title: "You need to log in to user this feature!",
      });
      return;
    }

    const postDocRef = doc(db, "posts", postId);
    const newComments = [
      ...posts[postIndex].comments,
      {
        username: currentUser.displayName ?? "",
        profilePicUrl: currentUser.photoURL ?? "",
        comment: comment,
      },
    ];
    updateDoc(postDocRef, {
      comments: newComments,
    });
    setPosts((prevPosts) => {
      prevPosts[postIndex].comments = newComments;
      return [...prevPosts];
    });
  };

  const handleShowComments = (postIndex: number, postId: string) => {
    const html = posts[postIndex].comments
      .map(
        (comment) =>
          `<div >
                  <article class="p-6 mb-3 text-base bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                  <footer class="flex justify-between items-center mb-2">
                      <div class="flex items-center">
                          <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                  class="mr-2 w-8 h-8 rounded-full"
                                  src="${comment.profilePicUrl}"
                                  alt="${comment.username}">${comment.username}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-03-12"
                                  title="March 12th, 2022">Mar. 12, 2022</time></p>
                      </div>
                      <button id="dropdownComment3Button" data-dropdown-toggle="dropdownComment3"
                          class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                          type="button">
                          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                              <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                          </svg>
                          <span class="sr-only">Comment settings</span>
                      </button>
                      <!-- Dropdown menu -->
                      <div id="dropdownComment3"
                          class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                          <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
                              aria-labelledby="dropdownMenuIconHorizontalButton">
                              <li>
                                  <a href="#"
                                      class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                              </li>
                              <li>
                                  <a href="#"
                                      class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                              </li>
                              <li>
                                  <a href="#"
                                      class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                              </li>
                          </ul>
                      </div>
                  </footer>
                  <p class="text-left text-gray-600">${comment.comment}</p>
              </article>
                </div>`
      )
      .join("");
    Swal.fire({
      html:
        `<div class="flex justify-between items-center mb-6">
            <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Comments</h2>
        </div>` +
        html +
        `<div class="max-w-2xl mx-auto px-4">
            <div class="mb-6">
                <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label for="comment" class="sr-only">Your comment</label>
                    <textarea id="comment" rows="6" class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800" placeholder="Write a comment..." required></textarea>
                </div>
            </div>
        </div>`,
      width: 800,
      showCancelButton: true,
      confirmButtonText: "Post comment",
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;
        const commentInput = popup.querySelector(
          "#comment"
        ) as HTMLInputElement;
        commentInput.focus();
        commentInput.onkeyup = (event) =>
          event.key === "Enter" && Swal.clickConfirm();
      },
      preConfirm: () => {
        const comment = (document.getElementById("comment") as HTMLInputElement)
          .value;
        if (!comment) {
          Swal.showValidationMessage(`Please enter a comment`);
        }
        return comment;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const comment = result.value;
        handleSubmitComment(postIndex, postId, comment);
      }
    });
  };

  const db = getFirestore();

  const handleLikeClick = (postIndex: number, postId: string) => {
    if (!currentUser) {
      Swal.fire({
        icon: "info",
        title: "You need to log in to user this feature!",
      });
      return;
    }

    // like photo
    if (!posts[postIndex].likes.includes(currentUser.uid)) {
      console.log("LIKING PHOTO");
      const postDocRef = doc(db, "posts", postId);
      const newLikes = [...posts[postIndex].likes, currentUser.uid];
      updateDoc(postDocRef, {
        likes: newLikes,
      });
      setPosts((prevPosts) => {
        prevPosts[postIndex].likes = newLikes;
        return [...prevPosts];
      });
    }

    // unlike photo
    else {
      console.log("UNLIKING PHOTO");
      const postDocRef = doc(db, "posts", postId);
      const indexOfMyLike = posts[postIndex].likes.indexOf(currentUser.uid);
      const newLikes = posts[postIndex].likes;
      newLikes.splice(indexOfMyLike, 1);
      updateDoc(postDocRef, {
        likes: newLikes,
      });
      setPosts((prevPosts) => {
        prevPosts[postIndex].likes = newLikes;
        return [...prevPosts];
      });
    }
  };

  return (
    <div className="pt-20 flex flex-col min-h-screen justify-center items-center">
      {posts.map((post, index) => (
        <Post
          post={post}
          index={index}
          handleLikeClick={handleLikeClick}
          showComments={handleShowComments}
        />
      ))}
    </div>
  );
}

export default Feed;
