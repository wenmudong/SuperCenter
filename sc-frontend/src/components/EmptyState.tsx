interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "No items yet." }: EmptyStateProps) {
  return (
    <div className="flex justify-center py-12">
      <p className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-3xl font-light tracking-wide text-transparent md:text-5xl">
        {message}
      </p>
    </div>
  );
}
