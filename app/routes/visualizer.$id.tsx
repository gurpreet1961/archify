import { useParams } from "react-router";

export default function Visualizer() {
    const { id } = useParams();
    const base64Data = sessionStorage.getItem(`archify-upload-${id}`);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white">Visualizer</h1>
                <p className="mt-2 text-gray-400">Project ID: {id}</p>
                {base64Data ? (
                    <img
                        src={base64Data}
                        alt="Uploaded floor plan"
                        className="mt-6 max-w-2xl mx-auto rounded-xl border border-gray-700"
                    />
                ) : (
                    <p className="mt-4 text-red-400">No upload data found for this project.</p>
                )}
            </div>
        </div>
    );
}
