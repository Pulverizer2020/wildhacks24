import {react} from "react"


const Landing = () => {

    return(
    <>
        <div className="backdrop-blur-xl flex flex-column p-10 items-center justify-center w-screen h-[40vh]">
            
            <h1 className="text-7xl text-center">You know your <span style={{ color: 'rgb(127, 240, 168)' }}>community</span> best. Now you can <span style={{ color: 'rgb(83, 237, 229)' }}>design</span> it.</h1>
        </div>
        <div className="mt-17 mb-10 flex flex-row items-center justify-center">
            <h2 className="w-[60vw] text-center">Punch in an address and start redesigning any block, anywhere on Earth with our interactive map. When you're happy with what you've got, be sure to post it to our forum to see what your neighbors think!
            </h2>
        </div>
    </>





    );



};

export default Landing;
