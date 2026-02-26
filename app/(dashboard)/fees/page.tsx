import getFees from "@/actions/fee";
import FeesTable from "@/components/tables/FeesTable";
import FeesHeader from "./FeesHeader";

export default async function FeePage() {
    const res = await getFees();
    const fees: Fee[] = Array.isArray(res) ? res : [];

    return (
        <main>
            <FeesHeader />

            <section className="py-5 px-8 flex flex-col items-center justify-between w-full border-b-gradient bg-background z-50">
                <FeesTable fees={fees} />
            </section>
        </main>
    );
}
