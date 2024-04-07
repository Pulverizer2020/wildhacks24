import { useAuth } from "../utils/authContext";

function Navbar() {
  const { currentUser, loginWithGoogle, logout } = useAuth();
  const handleLogin = () => {
    loginWithGoogle();
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="">
        <div className="mt-2 max-w-screen-xl flex flex-column items-center justify-between mx-auto p-2">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
              Name
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {currentUser ? (
              <>
                <img
                  alt="User Profile"
                  className="w-10 h-10 rounded-full"
                />
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 border-0">
              <li className="hover:scale-110 duration-150">
                {/*Currently Selected: className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"*/}
                <a
                  href="/map"
                  className=""
                  aria-current="page"
                >
                  Map Editor
                </a>
              </li>
              <li className="hover:scale-110 duration-150">
                <a
                  href="/feed"
                  aria-current="page"
                >
                  Feed
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="mb-5"></div>
    </>
  );
}

export default Navbar;
