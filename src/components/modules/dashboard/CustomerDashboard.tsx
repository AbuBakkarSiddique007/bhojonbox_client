

type Props = {
  mealsCount: number | null;
  ordersCount: number | null;
};

export default function CustomerDashboard({ mealsCount, ordersCount }: Props) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Available Meals</p>
          <p className="text-2xl font-semibold">{mealsCount ?? "-"}</p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-muted-foreground">Your Orders</p>
          <p className="text-2xl font-semibold">{ordersCount ?? "-"}</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">Quick links: Browse meals, view cart.</div>
    </div>
  );
}
