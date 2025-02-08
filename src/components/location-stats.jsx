/* eslint-disable react/prop-types */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Location({countries}) {
  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <LineChart width={700} height={300} data={countries}>
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip labelStyle={{color: "green"}} />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
