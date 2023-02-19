import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="p-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Error <span style={{ color: "red" }}>Pages</span>
      </h1>

      <hr />

      <div className="mt-6">
        <p>Sorry, The page you are looking for can&apos;t be found</p>

        <p>Try checking your URL</p>

        <br />
        <br />

        <Link
          className="text-sm font-bold py-2 px-8 md:px-4 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
          href={`/`}
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
