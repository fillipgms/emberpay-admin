import { getDashboardData } from "@/actions/dashboard";
import { usePermissions } from "@/hooks/usePermissions";
import Hero from "./home/sections/Hero";
import InfoCard from "./home/sections/InfoCard";
import SalesAndOutflowsChart from "@/components/charts/SalesAndOutflowsChart";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string }>;
}) {
    const params = await searchParams;
    const dateStart = params.dateStart;
    const dateEnd = params.dateEnd;

    const res = await getDashboardData(dateStart, dateEnd);

    return (
        <main>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">Dashboard</p>
            </section>
            <Hero />
            <section className="py-5 overflow-hidden relative px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 w-full gap-2">
                    <InfoCard title="Saldo" value={res.total_balance} />
                    <InfoCard
                        title="Transações"
                        value={res.total_transactions}
                    />
                    <div className="md:hidden divisor border-b-gradient col-span-2"></div>
                    <InfoCard title="Taxa" value={res.fee} />
                    <div className="hidden divisor md:block xl:hidden border-b-gradient col-span-3"></div>
                    <InfoCard title="Split" value={res.split} />
                    <div className="md:hidden divisor border-b-gradient col-span-2"></div>
                    <InfoCard title="Saídas" value={res.exists} />
                    <InfoCard title="Taxa de Saídas" value={res.fee_exists} />
                </div>
                <div className="bg-primary/50 size-200 rounded-full blur-3xl absolute -z-10 left-1/5 top-1/3" />
            </section>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <div className="dashboardCard border-gradient w-full rounded-md p-4 flex flex-col justify-center gap-4 border relative overflow-hidden">
                    <div className="w-full h-64 rounded-xl growth-item">
                        <SalesAndOutflowsChart data={res.last_7_days} />
                    </div>
                </div>
            </section>
        </main>
    );
}
