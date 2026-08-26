import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoaderCircle className="w-10 h-10 text-indigo-500 animate-spin" />
    </div>
  );
}
