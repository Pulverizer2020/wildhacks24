const Landing = () => {
  return (
    <>
      <div className="flex flex-column items-center justify-center w-screen mt-[120px]">
        <h1 className="text-7xl text-center max-w-6xl">
          You know your{" "}
          <span style={{ color: "rgb(127, 240, 168)" }}>community</span> best.
          Now you can <span style={{ color: "rgb(83, 237, 229)" }}>design</span>{" "}
          it.
        </h1>
      </div>
      <div className="flex flex-row items-center justify-center mt-10">
        <h2 className="w-[60vw] text-center">
          Punch in an address and start redesigning any block.
          <br /> When you're done, create a shareable link!
        </h2>
      </div>
    </>
  );
};

export default Landing;
