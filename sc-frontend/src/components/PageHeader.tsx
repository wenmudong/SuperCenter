import { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  if (!title && !description && !children) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 px-2 pt-4 pb-8 md:gap-8">
      {title && (
        <h1 className="font-sans text-6xl font-extralight text-neutral-900 md:text-8xl">
          {title}
        </h1>
      )}
      {description && (
        <p className="max-w-prose tracking-tight text-neutral-400">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
