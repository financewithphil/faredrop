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
      <div style={{ color: "var(--text-muted)", textAlign: "center", padding: 32, fontFamily: "var(--font-body)", fontSize: 14 }}>
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
            tick={{ fill: "#505868", fontSize: 11, fontFamily: "'Outfit', sans-serif" }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#505868", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 18, 28, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "#eef0f4",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              backdropFilter: "blur(8px)",
            }}
            formatter={(value: number) => [`$${value}`, "Current Price"]}
          />
          <ReferenceLine
            y={pricePaid}
            stroke="rgba(248, 113, 113, 0.5)"
            strokeDasharray="6 4"
            label={{
              value: `Paid $${pricePaid}`,
              fill: "#f87171",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ fill: "#60a5fa", r: 3, stroke: "rgba(96,165,250,0.3)", strokeWidth: 4 }}
            activeDot={{ fill: "#60a5fa", r: 5, stroke: "rgba(96,165,250,0.4)", strokeWidth: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
