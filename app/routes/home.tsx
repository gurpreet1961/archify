import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Hero from "../../components/Hero";
import UploadContainer from "../../components/UploadContainer";
import Projects from "../../components/Projects";
import { getOrCreateHostingConfig, uploadImageToHosting } from "../../lib/puter.hosting";
import { setUploadData } from "../../lib/upload-store";

/**
 * Provide metadata entries for the Home route.
 *
 * @returns An array of metadata objects including the page `title` and a `description` content entry.
 */
export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Archify" },
    { name: "description", content: "Archify - visualize, render, and ship architectural projects." },
  ];
}

/**
 * Render the application home page and handle upload completion to open the visualizer.
 *
 * @returns The Home page React element.
 */
export default function Home() {
  const navigate = useNavigate();
  const [hosting, setHosting] = useState<HostingConfig | null>(null);
  const [pendingUploads, setPendingUploads] = useState<Omit<StoreHostedImageParams, "hosting">[]>([]);

  useEffect(() => {
    getOrCreateHostingConfig()
      .then(setHosting)
      .catch((err) => console.error("Failed to initialize hosting config:", err));
  }, []);

  // Drain pending upload queue once hosting becomes available
  useEffect(() => {
    if (!hosting || pendingUploads.length === 0) return;

    const queue = [...pendingUploads];
    setPendingUploads([]);

    Promise.allSettled(
      queue.map((params) =>
        uploadImageToHosting({ ...params, hosting })
      )
    ).then((results) => {
      const failed = queue.filter((_, i) => results[i].status === "rejected");
      if (failed.length > 0) {
        console.error(`${failed.length} queued upload(s) failed; re-queuing.`);
        setPendingUploads((prev) => [...prev, ...failed]);
      }
    });
  }, [hosting, pendingUploads]);

  const handleUploadComplete = async (base64Data: string) => {
    const projectId = crypto.randomUUID();
    setUploadData(projectId, base64Data);

    const uploadParams: Omit<StoreHostedImageParams, "hosting"> = {
      url: base64Data,
      projectId,
      label: "source",
    };

    if (hosting) {
      uploadImageToHosting({ ...uploadParams, hosting }).catch((err) =>
        console.error("Puter upload failed:", err)
      );
    } else {
      console.warn("Hosting not ready; upload queued for retry.");
      setPendingUploads((prev) => [...prev, uploadParams]);
    }

    navigate(`/visualizer/${projectId}`);
  };
  return (
    <div className="relative isolate overflow-hidden bg-gray-900">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <Navbar />
      <Hero />
      <UploadContainer onComplete={handleUploadComplete} />
      <Projects />

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
