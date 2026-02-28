type Props = {
  inline?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
};

export default function Loading({ inline = false, size = "md", label }: Props) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-12 w-12" : "h-8 w-8";
  const spinner = <div className={`${sizeClass} animate-spin rounded-full border-2 border-primary border-t-transparent`} />;

  if (inline) {
    return (
      <div className="inline-flex items-center">
        {spinner}
        {label ? <span className="ml-2 text-sm">{label}</span> : null}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
      {label ? <div className="mt-2 text-sm">{label}</div> : null}
    </div>
  );
}
