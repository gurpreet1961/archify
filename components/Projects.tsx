import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";
import { getUserProjects } from "../lib/puter.action";

export default function Projects() {
    const { isSignedIn } = useAuth();
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSignedIn) {
            setProjects([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        getUserProjects()
            .then(setProjects)
            .finally(() => setLoading(false));
    }, [isSignedIn]);

    if (!isSignedIn) return null;

    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
            <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Your Projects
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-300">
                    Manage and view your ongoing architectural renderings.
                </p>
            </div>

            {loading && (
                <div className="mt-10 border-t border-gray-700 pt-10">
                    <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex flex-col bg-gray-800/50 rounded-2xl p-6 animate-pulse"
                            >
                                <div className="w-full aspect-[16/9] mb-4 rounded-xl bg-gray-700" />
                                <div className="h-4 w-24 bg-gray-700 rounded" />
                                <div className="h-5 w-48 bg-gray-700 rounded mt-3" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && projects.length === 0 && (
                <div className="mt-10 border-t border-gray-700 pt-10 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                    </svg>
                    <p className="mt-4 text-lg font-medium text-gray-300">
                        No projects yet
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Upload a floor plan above to create your first project.
                    </p>
                </div>
            )}

            {!loading && projects.length > 0 && (
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {projects.map((project) => {
                        const displayImage =
                            project.renderedImage || project.sourceImage;
                        const dateStr = new Date(project.timestamp).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" }
                        );
                        const status: string = project.renderedImage
                            ? "Completed"
                            : "Draft";

                        return (
                            <article
                                key={project.id}
                                className="flex max-w-xl flex-col items-start justify-between bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800 transition-colors duration-200"
                            >
                                <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden rounded-xl bg-gray-700">
                                    {displayImage ? (
                                        <img
                                            src={displayImage}
                                            alt={project.name || "Project"}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg
                                                className="h-10 w-10 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-x-4 text-xs">
                                    <time dateTime={dateStr} className="text-gray-400">
                                        {dateStr}
                                    </time>
                                    <span
                                        className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${status === "Completed"
                                                ? "bg-green-500/10 text-green-400"
                                                : "bg-gray-500/10 text-gray-400"
                                            }`}
                                    >
                                        {status}
                                    </span>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                                        <Link to={`/visualizer/${project.id}`}>
                                            <span className="absolute inset-0" />
                                            {project.name || `Project ${project.id.slice(0, 8)}`}
                                        </Link>
                                    </h3>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
