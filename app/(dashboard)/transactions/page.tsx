import { getTransactionsData } from "@/actions/transactions";
import PaginationControls from "@/components/Pagination";
import TransactionsTable from "@/components/tables/TransactionsTable";
import TransactionFilters from "./TransactionFilters";

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string }>;
}) {
    const params = await searchParams;
    const filter = params.filter;
    const user = params.user;
    const status = params.status;
    const apply = params.apply;
    const start_date = params.startDate;
    const end_date = params.dateEnd;
    const search = params.search;

    const resp = (await getTransactionsData(
        filter,
        user,
        status,
        apply,
        start_date,
        end_date,
        search,
    )) as TransactionsResponse;

    const res: TransactionsResponse = {
        current_page: 1,
        data: [
            {
                id: "TRX-20260129111832-9460",
                id_bank: "4IBJFCDKPVPIZ2071943131769696312052",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Entrada",
                status: "Pendente",
                amount: "R$ 20,00",
                fee: "R$ 1,00",
                split: "R$ 0,00",
                origin: "PIX",
                application: "WEB",
                description: null,
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "29/01/2026 11:18",
            },
            {
                id: "TRX-20260129111701-2478",
                id_bank: "TBTFKLP1QIOHY2071943131769696221294",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Entrada",
                status: "Pendente",
                amount: "R$ 20,00",
                fee: "R$ 0,20",
                split: "R$ 0,00",
                origin: "PIX",
                application: "WEB",
                description: null,
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "29/01/2026 11:17",
            },
            {
                id: "TRX-20260129111421-8019",
                id_bank: "AVGWH9WMXWHWUO071943131769696060815",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Entrada",
                status: "Pendente",
                amount: "R$ 20,00",
                fee: "R$ 0,00",
                split: "R$ 0,00",
                origin: "PIX",
                application: "WEB",
                description: null,
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "29/01/2026 11:14",
            },
            {
                id: "TRX-20260129111147-1938",
                id_bank: "HNPFMVVMU2JWVP071943131769695907033",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Entrada",
                status: "Pendente",
                amount: "R$ 20,00",
                fee: "R$ 0,00",
                split: "R$ 0,00",
                origin: "PIX",
                application: "WEB",
                description: null,
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "29/01/2026 11:11",
            },
            {
                id: "TRX-20260129110922-8647",
                id_bank: "AVSR9QQYEID0RF071943131769695761955",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Entrada",
                status: "Pendente",
                amount: "R$ 0,01",
                fee: "R$ 1,00",
                split: "R$ 0,00",
                origin: "PIX",
                application: "WEB",
                description: null,
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "29/01/2026 11:09",
            },
            {
                id: "TRX-20260129110833-9478",
                id_bank: "OOIXUIPP0QYC93071943131769695713050",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Entrada",
                status: "Pendente",
                amount: "R$ 0,01",
                fee: "R$ 1,00",
                split: "R$ 0,00",
                origin: "PIX",
                application: "WEB",
                description: null,
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "29/01/2026 11:08",
            },
            {
                id: "TRX-20260126143541-9641",
                id_bank: "semID",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Saída",
                status: "Pendente",
                amount: "R$ 100,00",
                fee: "R$ 0,10",
                split: "R$ 0,00",
                origin: "CRIPTO",
                application: "WEB",
                description: "Saque em crypto",
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "26/01/2026 14:35",
            },
            {
                id: "TRX-20260126143122-8072",
                id_bank: "semID",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Saída",
                status: "Pendente",
                amount: "R$ 100,00",
                fee: "R$ 0,10",
                split: "R$ 0,00",
                origin: "CRIPTO",
                application: "WEB",
                description: "Saque em crypto",
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "26/01/2026 14:31",
            },
            {
                id: "TRX-20260126142751-5727",
                id_bank: "semID",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Saída",
                status: "Pendente",
                amount: "R$ 100,00",
                fee: "R$ 0,10",
                split: "R$ 0,00",
                origin: "CRIPTO",
                application: "WEB",
                description: "Saque em crypto",
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "26/01/2026 14:27",
            },
            {
                id: "TRX-20260125204102-8814",
                id_bank: "E07194313202601252341GV5FkiqAIJK",
                userName: "Isaac Roque De Oliveira França",
                userEmail: "isaacroque0209@gmail.com",
                getaway: "sicoob",
                type: "Saída",
                status: "Aprovada",
                amount: "R$ 5,00",
                fee: "R$ 0,00",
                split: "R$ 0,00",
                origin: "PIX",
                application: "API",
                description: "Pagamento do pedido 123456123",
                payer_name: "Nada...",
                payer_document: "Nada...",
                credential_description: "Feita pelo painel",
                webhook: null,
                created_at: "25/01/2026 20:41",
            },
        ],
        first_page_url: "http://127.0.0.1:8000/api/admin/transactions?page=1",
        from: 1,
        last_page: 2,
        last_page_url: "http://127.0.0.1:8000/api/admin/transactions?page=2",
        links: [
            {
                url: null,
                label: "&laquo; Previous",
                active: false,
            },
            {
                url: "http://127.0.0.1:8000/api/admin/transactions?page=1",
                label: "1",
                active: true,
            },
            {
                url: "http://127.0.0.1:8000/api/admin/transactions?page=2",
                label: "2",
                active: false,
            },
            {
                url: "http://127.0.0.1:8000/api/admin/transactions?page=2",
                label: "Next &raquo;",
                active: false,
            },
        ],
        next_page_url: "http://127.0.0.1:8000/api/admin/transactions?page=2",
        path: "http://127.0.0.1:8000/api/admin/transactions",
        per_page: 10,
        prev_page_url: null,
        to: 10,
        total: 18,
        users: [
            {
                id: 1,
                email: "isaacroque0209@gmail.com",
            },
        ],
    };
    const data = res.data;

    return (
        <main>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">Transações</p>
            </section>

            <TransactionFilters data={res} />

            <section className="py-5 px-8 flex flex-col items-center justify-between w-full border-b-gradient bg-background z-50">
                <TransactionsTable transactions={data} />
                <PaginationControls
                    currentPage={res.current_page}
                    lastPage={res.last_page}
                    hasNextPage={!!res.next_page_url}
                    hasPrevPage={!!res.prev_page_url}
                    baseUrl="/transactions"
                    searchParams={params}
                />
            </section>
        </main>
    );
}
