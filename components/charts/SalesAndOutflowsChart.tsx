"use client";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LineChart,
} from "recharts";
import { useChartColors } from "@/hooks/useChartColors";
import { CHART_MARGIN } from "@/constants/dashboardData";

interface DataPoint {
    date: string;
    sales: number;
    outflows: number;
}

interface SalesAndOutflowsChartProps {
    data: DataPoint[];
}

const SalesAndOutflowsChart = ({ data }: SalesAndOutflowsChartProps) => {
    const chartColors = useChartColors();

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={256}>
            <LineChart data={data} margin={CHART_MARGIN}>
                <CartesianGrid stroke={chartColors.grid} strokeOpacity={0.5} />
                <XAxis
                    dataKey="date"
                    stroke={chartColors.stroke}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: string) => {
                        const [day, month] = value.split("/");
                        return `${day}/${month}`;
                    }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    stroke={chartColors.stroke}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: chartColors.tooltipBg,
                        border: `1px solid ${chartColors.tooltipBorder}`,
                        borderRadius: 8,
                        color: chartColors.tooltipText,
                    }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                />
                <Legend
                    wrapperStyle={{
                        color: chartColors.stroke,
                        fontSize: 13,
                        paddingTop: 12,
                    }}
                />
                <Line
                    dataKey="outflows"
                    stroke="#737B91"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                />
                <Line
                    type="monotone"
                    dataKey="sales"
                    stroke={chartColors.areaStroke}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SalesAndOutflowsChart;
