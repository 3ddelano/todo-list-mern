import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="mx-auto flex max-w-7xl flex-grow items-center justify-center sm:my-32">
            <div className="relative pl-4">
                <div className="sm:l-0 sm:absolute">
                    <span className="text-2xl text-red-600 sm:-ml-28 sm:border-r-2 sm:pr-4 sm:text-4xl md:-ml-32 md:text-[3rem]">
                        404
                    </span>
                </div>

                <h1 className="text-2xl font-bold sm:text-4xl md:text-[3rem]">
                    Page Not Found
                </h1>
                <span className="text-gray-400 md:mt-2 md:block md:text-xl">
                    Please check the URL in the address bar and try again.
                </span>
                <div className="mt-6 flex">
                    <Link
                        to="/"
                        className="flex items-center justify-center rounded-md border border-transparent bg-green-600 py-2 px-5 text-base font-medium text-white hover:bg-green-700"
                    >
                        Go back home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
