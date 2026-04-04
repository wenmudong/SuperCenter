import GradientText from "./GradientText";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "No items yet." }: EmptyStateProps) {
  return (
    <div className="flex justify-center py-12">
      <GradientText className="text-3xl font-light tracking-wide md:text-5xl">
        {message}
      </GradientText>
    </div>
  );
}
