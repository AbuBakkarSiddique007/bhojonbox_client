export default function EmptyState({ message }: { message?: string }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-muted-foreground">{message ?? "Nothing to show."}</p>
    </div>
  );
}
