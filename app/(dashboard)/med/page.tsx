import { getMedData } from "@/actions/med";
import PaginationControls from "@/components/Pagination";
import MedTable from "@/components/tables/MedTable";
import MedFilters from "./MedFilters";

export default async function MedPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string }>;
}) {
    const params = await searchParams;
    const user = params.user;
    const page = params.page;

    const resp = (await getMedData(user, page)) as MedResponse;

    return (
        <main>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">MED</p>
            </section>

            {resp && <MedFilters data={resp} />}

            <section className="py-5 px-8 flex flex-col items-center justify-between w-full border-b-gradient bg-background z-50">
                {resp?.data ? (
                    <>
                        <MedTable items={resp.data} />
                        <PaginationControls
                            currentPage={resp.current_page}
                            lastPage={resp.last_page}
                            hasNextPage={!!resp.next_page_url}
                            hasPrevPage={!!resp.prev_page_url}
                            baseUrl="/med"
                            searchParams={params}
                        />
                    </>
                ) : (
                    <p className="text-foreground/50 text-sm py-10">
                        Nenhum dado disponível.
                    </p>
                )}
            </section>
        </main>
    );
}
