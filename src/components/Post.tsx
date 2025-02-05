/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { useRef } from "react";
import { useAuth } from "../utils/authContext";
import { MapType } from "../pages/FeedPage";
import loadMapDataToIframe from "../utils/loadMapDataToIframe";
import { PiMagicWandFill } from "react-icons/pi";

const Post = (props: {
  map: MapType;
  index: number;
  handleLikeClick: (postIndex: number, postId: string) => void;
  showComments: (postIndex: number, postId: string) => void;
}) => {
  const { currentUser } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(document.createElement("iframe"));

  const handleIframeLoad = () => {
    console.log("props.map.mapState", props.map.mapState);

    loadMapDataToIframe(props.map.mapState, iframeRef);
  };

  return (
    <div className="rounded-3xl overflow-hidden border w-full sm:w-[500px]  bg-gray-50 text-gray-900 mx-3 md:mx-0 lg:mx-0 mb-4">
      <div className="w-full flex justify-between p-3 outline-gray-500">
        <div className="flex">
          <div className="rounded-full h-8 w-8 bg-gray-500 flex items-center justify-center overflow-hidden">
            <img src={props.map.profilePicUrl} alt="profilepic"></img>
          </div>
          <span className="my-auto ml-2 font-bold text-sm">
            {props.map.username}
          </span>
        </div>
        <span className="px-2 hover:bg-gray-300 cursor-pointer rounded">
          <i className="fas fa-ellipsis-h pt-2 text-lg"></i>
        </span>
      </div>
      <div>
        <span className="flex justify-between pb-2 pl-3 font-bold text-lg">
          {props.map.title}
        </span>
      </div>
      <iframe
        ref={iframeRef}
        onLoad={() => handleIframeLoad()}
        style={{ width: "100%", height: "500px" }}
        src="viewMap.html"
      />
      <div className="px-3 pb-2 pt-2">
        <div className="flex items-center justify-between text-gray-900">
          <div className="flex items-center space-x-2">
            <button className="flex justify-center items-center gap-2 px-2 hover:scale-105 duration-150">
              <svg
                fill={
                  props.map.likes.includes(currentUser?.uid ?? "")
                    ? "red"
                    : "grey"
                }
                stroke-width="0"
                viewBox="0 0 512 512"
                height="20px"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
              </svg>

              <div
                onClick={() =>
                  props.handleLikeClick(props.index, props.map.postId)
                }
              >
                {props.map.likes.length} Likes{" "}
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
              onClick={() => props.showComments(props.index, props.map.postId)}
            >
              {props.map.comments.length} Comments
            </span>
          </button>

          <button className="bg-[#FFD700] h-12 rounded-3xl flex justify-center items-center gap-2 px-2 hover:scale-105 duration-150">
            <PiMagicWandFill />
            <a
              href={`${import.meta.env.VITE_HOST}/map?uuid=${props.map.mapId}`}
            >
              {" "}
              Remap!
            </a>
          </button>
        </div>
        <div className="pt-2">
          <i className="far fa-heart cursor-pointer"></i>
          <span className="text-sm text-gray-500 font-medium">
            Created on {props.map.createdAt.toDate().toDateString()}
          </span>
        </div>
        <div className="pt-1">
          <div className="mb-2 text-sm">
            <span className="font-medium mr-2">{props.map.username}</span>
            <span className="font-normal">{props.map.description}</span>
          </div>
        </div>
        <div className="text-sm mb-2 text-gray-500 cursor-pointer font-medium">
          <button
            onClick={() => props.showComments(props.index, props.map.postId)}
          >
            View all {props.map.comments.length} comments
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
