import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router";

interface Project {
    id: string;
    title: string;
    thumbnail: string;
    date: string;
    status: "Completed" | "Processing" | "Draft";
}

const MOCK_PROJECTS: Project[] = [
    {
        id: "1",
        title: "Modern Loft Renovation",
        thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-02-15",
        status: "Completed",
    },
    {
        id: "2",
        title: "Eco-Friendly Villa",
        thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-02-10",
        status: "Processing",
    },
    {
        id: "3",
        title: "Minimalist Office Complex",
        thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-02-01",
        status: "Draft",
    },
];

export default function Projects() {
    const { isSignedIn } = useAuth();

    if (!isSignedIn) {
        return null;
    }

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
            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {MOCK_PROJECTS.map((project) => (
                    <article
                        key={project.id}
                        className="flex max-w-xl flex-col items-start justify-between bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800 transition-colors duration-200"
                    >
                        <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden rounded-xl">
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex items-center gap-x-4 text-xs">
                            <time dateTime={project.date} className="text-gray-400">
                                {project.date}
                            </time>
                            <span
                                className={`relative z-10 rounded-full px-3 py-1.5 font-medium ${project.status === "Completed"
                                        ? "bg-green-500/10 text-green-400"
                                        : project.status === "Processing"
                                            ? "bg-yellow-500/10 text-yellow-400"
                                            : "bg-gray-500/10 text-gray-400"
                                    }`}
                            >
                                {project.status}
                            </span>
                        </div>
                        <div className="group relative">
                            <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                                <Link to="#">
                                    <span className="absolute inset-0" />
                                    {project.title}
                                </Link>
                            </h3>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
