import { Target } from "lucide-react"; // Using Target as a placeholder for "Lens"

export function AppLogo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Target className="h-8 w-8 text-primary" />
      <h1 className="font-headline text-2xl font-semibold text-primary">
        DataLens
      </h1>
    </div>
  );
}
