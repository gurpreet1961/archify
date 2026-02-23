import { useState, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
    PROGRESS_INTERVAL_MS,
    PROGRESS_STEP,
    REDIRECT_DELAY_MS,
} from "../lib/constants";

interface UploadContainerProps {
    onComplete?: (base64Data: string) => void;
}

/**
 * Upload area component that lets signed-in users select or drag-and-drop a JPG/PNG (≤10MB), shows upload progress, and calls `onComplete` with the file's base64 data when finished.
 *
 * @param onComplete - Optional callback invoked with the file's base64-encoded data after the simulated upload completes.
 * @returns The upload container React element.
 */
export default function UploadContainer({ onComplete }: UploadContainerProps) {
    const { isSignedIn, signIn } = useAuth();
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const validateFile = (file: File): boolean => {
        // Check type
        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(file.type)) {
            setError("Please upload a JPG or PNG file.");
            return false;
        }
        // Check size (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("File size must be less than 10MB.");
            return false;
        }
        return true;
    };

    const processFile = useCallback(
        (file: File) => {
            const reader = new FileReader();

            reader.onload = () => {
                const base64Data = reader.result as string;
                setProgress(0);

                const interval = setInterval(() => {
                    setProgress((prev) => {
                        const next = prev + PROGRESS_STEP;
                        if (next >= 100) {
                            clearInterval(interval);
                            setTimeout(() => {
                                onComplete?.(base64Data);
                            }, REDIRECT_DELAY_MS);
                            return 100;
                        }
                        return next;
                    });
                }, PROGRESS_INTERVAL_MS);
            };

            reader.onerror = () => {
                setError("Failed to read file. Please try again.");
            };

            reader.readAsDataURL(file);
        },
        [onComplete]
    );

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (!isSignedIn) {
            signIn();
            return;
        }

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                setFile(droppedFile);
                setError(null);
                processFile(droppedFile);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!isSignedIn) {
            signIn();
            return;
        }

        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
                setError(null);
                processFile(selectedFile);
            }
        }
    };

    const onButtonClick = () => {
        if (!isSignedIn) {
            signIn();
        } else {
            inputRef.current?.click();
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
            <div className="mx-auto max-w-2xl text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Start your project
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-300">
                    Upload your floor plan to get started. We support JPG and PNG up to 10MB.
                </p>
            </div>

            <div
                id="upload-section"
                className={`relative flex flex-col items-center justify-center w-full max-w-3xl mx-auto h-64 border-2 border-dashed rounded-2xl transition-all duration-300 ${isDragging
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-gray-600 bg-gray-900/50 hover:border-gray-500 hover:bg-gray-800/50"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={handleChange}
                />

                {file ? (
                    <div className="text-center p-6">
                        <svg
                            className="mx-auto h-12 w-12 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <p className="mt-2 text-sm text-gray-400">Selected file:</p>
                        <p className="text-lg font-semibold text-white">{file.name}</p>

                        {progress > 0 && progress < 100 && (
                            <div className="mt-4 w-64 mx-auto">
                                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all duration-150"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-400">{progress}%</p>
                            </div>
                        )}

                        {progress === 100 && (
                            <p className="mt-2 text-sm text-green-400">Upload complete!</p>
                        )}

                        {progress === 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                }}
                                className="mt-4 text-sm font-medium text-red-400 hover:text-red-300"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-center p-6" onClick={onButtonClick}>
                        {/* Upload Icon */}
                        <svg
                            className={`mx-auto h-12 w-12 transition-colors duration-300 ${isDragging ? "text-indigo-400" : "text-gray-400"
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                        <p className="mt-4 text-lg font-medium text-white">
                            {isDragging
                                ? "Drop your file here"
                                : isSignedIn
                                    ? "Drop your floor plan here"
                                    : "Sign in to upload"}
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            or <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">click to browse</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            JPG, PNG up to 10MB
                        </p>
                    </div>
                )}

                {/* Click overlay for non-signed in users to ensure they hit the sign in action easily */}
                {!isSignedIn && (
                    <div className="absolute inset-0 z-10 cursor-pointer" onClick={signIn} />
                )}
            </div>

            {error && (
                <div className="mt-4 mx-auto max-w-3xl text-center">
                    <p className="text-sm font-medium text-red-500 bg-red-500/10 py-2 px-4 rounded-lg inline-block">
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
