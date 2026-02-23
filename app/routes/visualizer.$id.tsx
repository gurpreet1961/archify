import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { getUploadData } from "../../lib/upload-store";
import { getProjectById } from "../../lib/puter.action";

/**
 * Visualizer route component that displays an uploaded image for the current project ID.
 *
 * First checks the in-memory upload store for data (fresh uploads). If not found,
 * falls back to fetching the project from the Puter worker API via getProjectById.
 */
export default function Visualizer() {
    const { id } = useParams();
    const [imageData, setImageData] = useState<string | null>(null);
    const [project, setProject] = useState<DesignItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("No project ID provided.");
            setLoading(false);
            return;
        }

        // Check in-memory store first (available right after upload)
        const localData = getUploadData(id);
        if (localData) {
            setImageData(localData);
            setLoading(false);
            return;
        }

        // Fallback: fetch from Puter worker API
        getProjectById({ id })
            .then((result) => {
                if (result) {
                    setProject(result);
                    setImageData(result.sourceImage);
                } else {
                    setError("No project found for this ID.");
                }
            })
            .catch(() => setError("Failed to load project."))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Visualizer</h1>
                {import.meta.env.DEV && (
                    <p className="mt-2 text-gray-400">Project ID: {id}</p>
                )}

                {loading && (
                    <p className="mt-4 text-gray-400 animate-pulse">Loading project...</p>
                )}

                {error && (
                    <p className="mt-4 text-red-400">{error}</p>
                )}

                {imageData && (
                    <img
                        src={imageData}
                        alt={project?.name || "Uploaded floor plan"}
                        className="mt-6 max-w-2xl mx-auto rounded-xl border border-gray-700"
                    />
                )}
            </div>
        </div>
    );
}
