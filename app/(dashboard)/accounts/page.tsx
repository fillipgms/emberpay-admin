import { getAccountsData } from "@/actions/accounts";
import PaginationControls from "@/components/Pagination";
import AccountsTable from "@/components/tables/AccountsTable";
import AccountFilters from "./AccountFilters";

export default async function AccountsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string }>;
}) {
    const params = await searchParams;
    const search = params.search;
    const verify = params.verify;
    const page = params.page;

    const res = (await getAccountsData(search, verify, page)) as AccountsResponse;

    const data = res?.data ?? [];

    return (
        <main>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">Contas</p>
            </section>

            <AccountFilters />

            <section className="py-5 px-8 flex flex-col items-center justify-between w-full border-b-gradient bg-background z-50">
                <AccountsTable accounts={data} />
                {res && (
                    <PaginationControls
                        currentPage={res.current_page}
                        lastPage={res.last_page}
                        hasNextPage={!!res.next_page_url}
                        hasPrevPage={!!res.prev_page_url}
                        baseUrl="/accounts"
                        searchParams={params}
                    />
                )}
            </section>
        </main>
    );
}
