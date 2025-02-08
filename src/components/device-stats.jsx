/* eslint-disable react/prop-types */
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function App({devices}) {
  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>
        <PieChart width={700} height={400}>
          <Pie
            data={devices}
            labelLine={false}
            label={({device, percent}) =>
              `${device}: ${(percent * 100).toFixed(0)}%`
            }
            dataKey="count"
          >
            {devices.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
