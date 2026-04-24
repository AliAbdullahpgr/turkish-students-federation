import { ArrowLeft } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-[120px] lg:text-[180px] font-black text-primary leading-none">
          404
        </h1>
        <p className="text-xl text-text-secondary mt-4 mb-8">
          The page you were looking for does not exist
        </p>
        <PrimaryButton href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back Home
        </PrimaryButton>
      </div>
    </div>
  );
}
