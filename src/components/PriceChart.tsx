import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface PriceCheck {
  checked_at: string;
  current_price: number | null;
}

export function PriceChart({
  data,
  pricePaid,
}: {
  data: PriceCheck[];
  pricePaid: number;
}) {
  const chartData = data
    .filter((d) => d.current_price !== null)
    .map((d) => ({
      date: new Date(d.checked_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      price: d.current_price,
    }));

  if (chartData.length === 0) {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: 32 }}>
        No price data yet. Checks run 3x daily.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#f1f5f9",
            }}
            formatter={(value: number) => [`$${value}`, "Current Price"]}
          />
          <ReferenceLine
            y={pricePaid}
            stroke="#ef4444"
            strokeDasharray="6 3"
            label={{
              value: `Paid $${pricePaid}`,
              fill: "#ef4444",
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
