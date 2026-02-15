import type { Route } from "./+types/home";
import Navbar from "../../components/Navbar";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold underline">Home</h1>
      </div>
    </div>
  );
}
