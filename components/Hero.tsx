import { Link } from "react-router";

export default function Hero() {
    return (
        <div className="relative pt-14 pb-16 sm:pb-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                            Announcing our next round of funding.{" "}
                            <Link to="#" className="font-semibold text-white">
                                <span className="absolute inset-0" aria-hidden="true" />
                                Read more <span aria-hidden="true">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                            Visualize, Render, and Ship Architectural Projects Faster Than Ever
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            Archify is an AI-first design environment that helps you visualize,
                            render, and ship architectural project faster then ever.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={() => {
                                    const element = document.getElementById("upload-section");
                                    if (element) {
                                        element.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                                className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 cursor-pointer"
                            >
                                Get started
                            </button>
                            <Link to="#" className="text-sm font-semibold leading-6 text-white">
                                Live demo <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
