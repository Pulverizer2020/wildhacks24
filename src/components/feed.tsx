import React, { useState, useEffect } from 'react';
import { getFirestore, doc, setDoc, getDoc, getDocs, addDoc, collection } from "firebase/firestore";
import { nanoid } from 'nanoid';
import Swal from "sweetalert2";

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

    const handleSubmitComment = (comment) => {
        console.log("TODO: submit comment: " + comment);

    };

    const handleShowComments = (comments, title) => {
        const html = comments.map(comment =>
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
        ).join('');
        Swal.fire({
            html: `<div class="flex justify-between items-center mb-6">
            <h2 class="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Comments</h2>
        </div>` + html + `<div class="max-w-2xl mx-auto px-4">
            <div class="mb-6">
                <div class="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <label for="comment" class="sr-only">Your comment</label>
                    <textarea id="comment" rows="6" class="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800" placeholder="Write a comment..." required></textarea>
                </div>
            </div>
        </div>`,
            width: 800,
            showCancelButton: true,
            confirmButtonText: 'Post comment',
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup()!
                const commentInput = popup.querySelector('#comment') as HTMLInputElement
                commentInput.focus()
                commentInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
            },
            preConfirm: () => {
                const comment = (document.getElementById('comment') as HTMLInputElement).value
                if (!comment) {
                    Swal.showValidationMessage(`Please enter a comment`)
                }
                return comment
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const comment = result.value
                handleSubmitComment(comment)
            }
        });
    };

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
            comments: [{
                userName: "Positive Pal",
                posterProfilePic: "https://avatars.githubusercontent.com/u/30844089?v=4",
                comment: "This is great"
            },
            {
                userName: "Negative Nathan",
                posterProfilePic: "https://avatars.githubusercontent.com/u/30844089?v=4",
                comment: "This is not great"
            }
            ],
        };

        await setDoc(postDocRef, postData)
            .then(() => console.log("Post successfully created!"))
            .catch((error) => console.error("Error creating post: ", error));
    };

    return (
        <div className="pt-20 flex flex-col bg-black min-h-screen justify-center items-center">
            <button onClick={handleNewPost}>Create New Post</button>
            {posts.map((post, index) => (
                <div key={index} className="rounded overflow-hidden border w-full lg:w-4/12 md:w-6/12 bg-gray-50 text-gray-900 mx-3 md:mx-0 lg:mx-0 mb-4">
                    <div className="w-full flex justify-between p-3 outline-gray-500">
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
                    <div className="px-3 pb-2 pt-2">
                        <div class="flex items-center justify-between text-gray-900">
                            <div class="flex items-center space-x-2">
                                <button class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
                                    <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span>{post.likes} Likes</span>
                                </button>
                            </div>
                            <button class="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
                                <svg width="22px" height="22px" viewBox="0 0 24 24" class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"></path>
                                    </g>
                                </svg>
                                <span>{post.comments.length} Comments</span>
                            </button>

                            <button class="flex p-2.5 bg-yellow-500 rounded-xl hover:rounded-3xl hover:bg-yellow-600 transition-all duration-300 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span> Edit</span>
                            </button>

                        </div>
                        <div className="pt-2">
                            <i className="far fa-heart cursor-pointer"></i>
                            <span className="text-sm text-gray-500 font-medium">
                                Created at {post.postedTime}</span>
                        </div>
                        <div className="pt-1">
                            <div className="mb-2 text-sm">
                                <span className="font-medium mr-2">
                                    {post.userName}
                                </span>
                                {post.description}
                            </div>
                        </div>
                        <div className="text-sm mb-2 text-gray-500 cursor-pointer font-medium">
                            <button onClick={() => handleShowComments(post.comments, post.title)}>View all {post.comments.length} comments</button>
                        </div>
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