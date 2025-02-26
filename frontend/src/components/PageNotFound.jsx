import { Link } from "react-router-dom";
import pageNotFoundImage from "../assets/images/404.avif";
import fullLogo from "../assets/logo.png";

const PageNotFound = () => {
  return (
    <section className="h-cover my-24 relative p-10 flex flex-col items-center gap-10 text-center">
      <img
        src={pageNotFoundImage}
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />
      <h1 className="text-4xl font-gelasio leading-7">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 mt-8">
        The page you are looking for does not exists. Head back to the{" "}
        <Link to="/" className="text-black underline">
          home page
        </Link>
      </p>
      <div className="mt-auto">
        <img src={fullLogo} className="w-40 object-contain block mx-auto select-none" />
      </div>
    </section>
  );
};

export default PageNotFound;