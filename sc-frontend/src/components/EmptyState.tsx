interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "No items yet." }: EmptyStateProps) {
  return (
    <div className="flex justify-center py-12">
      <p
        className="text-3xl font-light tracking-wide md:text-5xl"
        style={{
          background: "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #0000FF, #8000FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {message}
      </p>
    </div>
  );
}
