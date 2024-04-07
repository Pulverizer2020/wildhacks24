import { useState } from "react";
import { useAuth } from "../utils/authContext";

function Navbar() {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const handleLogin = () => {
    loginWithGoogle();
  };
  const handleLogout = () => {
    logout();
  };

  const [toggleBurger, setToggleBurger] = useState(false);

  return (
    <>
      <nav
        style={{ backgroundColor: "#0d1116" }}
        className="flex flex-wrap items-center justify-between mx-auto px-6 fixed w-full z-20 top-0 start-0 h-14"
      >
        <a
          href={import.meta.env.VITE_HOST}
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Remap.city
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {currentUser ? (
            <>
              <img
                src={currentUser.photoURL ?? ""}
                alt="User Profile"
                className="w-10 h-10 rounded-full mr-2"
              />
              <button
                type="button"
                className="text-white font-medium rounded-lg text-sm px-4 py-2 text-center hover:scale-105 duration-150"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              className="bg-white text-black font-medium rounded-lg text-sm px-4 py-2 text-center hover:scale-105 duration-150"
              onClick={handleLogin}
            >
              Login with Google
            </button>
          )}
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={() =>
              setToggleBurger((oldToggleBurger) => !oldToggleBurger)
            }
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              {/* Currently Selected: className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" */}
              <a
                href="/map"
                className="block py-2 px-3 text-white rounded hover:text-[#7ff0a8] md:p-0"
                aria-current="page"
              >
                Map Editor
              </a>
            </li>
            <li>
              <a
                href="/feed"
                className="block py-2 px-3 text-white rounded hover:text-[#53ede5] md:p-0"
              >
                Feed
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {toggleBurger && (
        <div className="block md:hidden mt-16">
          <div className="h-20">
            <div className="w-fit mx-auto">
              <a
                href="/map"
                onClick={() =>
                  setToggleBurger((oldToggleBurger) => !oldToggleBurger)
                }
              >
                Map Editor
              </a>
            </div>
            <div className=" w-fit mx-auto">
              <a
                href="/feed"
                onClick={() =>
                  setToggleBurger((oldToggleBurger) => !oldToggleBurger)
                }
              >
                Feed
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="mb-5"></div>
    </>
  );
}

export default Navbar;
