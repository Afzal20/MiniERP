import { AuthButton } from "@/components/auth-button";
import HomeComponents from "@/components/HomeComponents";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Decorative dots - top right */}
      <div className="absolute top-20 right-20 grid grid-cols-3 gap-2 opacity-30">
        {Array.from({ length: 27 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
        ))}
      </div>

      {/* Decorative dots - bottom left */}
      <div className="absolute bottom-40 left-20 grid grid-cols-3 gap-2 opacity-30">
        {Array.from({ length: 27 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
        ))}
      </div>

      {/* Auth Button */}
      <div className="w-full flex justify-end p-4">
        <Suspense>
          <AuthButton />
        </Suspense>
      </div>
      <HomeComponents />
    </main>
  );
}