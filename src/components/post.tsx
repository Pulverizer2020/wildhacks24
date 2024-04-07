import { useEffect, useRef } from "react";
import { useAuth } from "../utils/authContext";
import { PostType } from "./feed";
import loadMapDataToIframe from "../utils/loadMapDataToIframe";
import hearticon from "../assets/favorite.png";

const Post = (props: {
  post: PostType;
  index: number;
  handleLikeClick: (postIndex: number, postId: string) => void;
  showComments: (postIndex: number, postId: string) => void;
}) => {
  const { currentUser } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));

  useEffect(() => {
    loadMapDataToIframe(props.post.mapId, iframeRef);
  }, []);

  return (
    <div
      key={props.index}
      className="rounded-3xl overflow-hidden border w-full sm:w-[500px]  bg-gray-50 text-gray-900 mx-3 md:mx-0 lg:mx-0 mb-4"
    >
      <div className="w-full flex justify-between p-3 outline-gray-500">
        <div className="flex">
          <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
            <img src={props.post.profilePicUrl} alt="profilepic"></img>
          </div>
          <span className="my-auto ml-2 font-bold text-sm">
            {props.post.username}
          </span>
        </div>
        <span className="px-2 hover:bg-gray-300 cursor-pointer rounded">
          <i className="fas fa-ellipsis-h pt-2 text-lg"></i>
        </span>
      </div>
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "500px" }}
        src="viewMap.html"
      />
      <div className="px-3 pb-2 pt-2">
        <div className="flex items-center justify-between text-gray-900">
          <div className="flex items-center space-x-2">
            <button className="flex justify-center items-center gap-2 px-2 hover:scale-105 duration-150">
              <img src={hearticon} style={{ width: "32px", height: "32px" }} />
              <div
                onClick={() =>
                  props.handleLikeClick(props.index, props.post.postId)
                }
              >
                {props.post.likes.length} Likes{" "}
                {props.post.likes.includes(currentUser?.uid) ? (
                  <>IS LIKED</>
                ) : (
                  <>IS NOT LIKED</>
                )}
              </div>
            </button>
          </div>
          <button className="flex justify-center items-center gap-2 px-2 hover:scale-105 duration-150">
            <svg
              width="22px"
              height="22px"
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"
                ></path>
              </g>
            </svg>
            <span
              onClick={() => props.showComments(props.index, props.post.postId)}
            >
              {props.post.comments.length} Comments
            </span>
          </button>

          <button className="flex justify-center items-center gap-2 px-2 hover:scale-105 duration-150">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <a
              href={`${import.meta.env.VITE_HOST}/map?uuid=${props.post.mapId}`}
            >
              {" "}
              Remap
            </a>
          </button>
        </div>
        <div className="pt-2">
          <i className="far fa-heart cursor-pointer"></i>
          <span className="text-sm text-gray-500 font-medium">
            Created on {props.post.createdAt.toDate().toDateString()}
          </span>
        </div>
        <div className="pt-1">
          <div className="mb-2 text-sm">
            <span className="font-medium mr-2">{props.post.username}</span>
            <span className="font-normal">{props.post.description}</span>
          </div>
        </div>
        <div className="text-sm mb-2 text-gray-500 cursor-pointer font-medium">
          <button
            onClick={() => props.showComments(props.index, props.post.postId)}
          >
            View all {props.post.comments.length} comments
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
