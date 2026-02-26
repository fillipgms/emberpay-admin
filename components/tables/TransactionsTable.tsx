"use client";

import { AgGridReact } from "ag-grid-react";
import { useCallback, useMemo, useState } from "react";
import {
    AllCommunityModule,
    type ColDef,
    ICellRendererParams,
    ModuleRegistry,
} from "ag-grid-community";
import { twMerge } from "tailwind-merge";
import { CheckIcon, ClockIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import { approveTransaction, returnTransaction } from "@/actions/transactions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface Transaction {
    id: string;
    id_bank: string;
    userName: string;
    userEmail: string;
    getaway: string;
    type: string; // "Entrada" | "Saída"
    status: string; // "Aprovada" | "Pendente" | "Recusada"
    amount: string;
    fee: string;
    split: string;
    origin: string;
    application: string;
    description: string | null;
    payer_name: string;
    payer_document: string;
    credential_description: string;
    webhook: string | null;
    created_at: string;
}

export type TransactionsArray = Transaction[];

const TransactionsTable = ({
    transactions,
}: {
    transactions: TransactionsArray;
}) => {
    const router = useRouter();
    const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
    const [rows, setRows] = useState(transactions);

    const setLoading = (id: string, val: boolean) =>
        setLoadingIds((prev) => ({ ...prev, [id]: val }));

    const approve = useCallback(async (id: string) => {
        setLoading(id, true);
        try {
            const res = await approveTransaction(id);
            if (res?.success) {
                toast.success("Transação aprovada com sucesso.");
                setRows((prev) =>
                    prev.map((t) =>
                        t.id === id ? { ...t, status: "Aprovada" } : t,
                    ),
                );
            } else {
                toast.error(res?.msg ?? "Erro ao aprovar transação.");
            }
        } catch {
            toast.error("Erro inesperado. Tente novamente.");
        } finally {
            setLoading(id, false);
        }
    }, []);

    const returnValue = useCallback(
        async (id: string) => {
            setLoading(id, true);
            try {
                const res = await returnTransaction(id);
                if (res?.success) {
                    toast.success("Reembolso realizado com sucesso.");
                    router.refresh();
                } else {
                    toast.error(res?.msg ?? "Erro ao reembolsar transação.");
                }
            } catch {
                toast.error("Erro inesperado. Tente novamente.");
            } finally {
                setLoading(id, false);
            }
        },
        [router],
    );

    const colDefs = useMemo<ColDef[]>(() => {
        return [
            {
                headerName: "ID",
                field: "id",
                pinned: "left",
                sortable: true,
                minWidth: 240,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="font-mono text-xs truncate">
                            {p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Data",
                field: "created_at",
                suppressMovable: true,
                minWidth: 150,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <span className="text-sm">{p.value}</span>
                    </div>
                ),
            },
            {
                headerName: "Tipo",
                field: "type",
                suppressMovable: true,
                width: 100,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => {
                    const isEntrada = p.value === "Entrada";
                    return (
                        <div className="flex items-center justify-center h-full w-full">
                            <span
                                className={twMerge(
                                    "px-3 py-1 rounded-md text-xs font-semibold",
                                    isEntrada
                                        ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                        : "bg-orange-500/15 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
                                )}
                            >
                                {p.value}
                            </span>
                        </div>
                    );
                },
            },
            {
                headerName: "Status",
                field: "status",
                minWidth: 130,
                suppressMovable: true,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => {
                    const isApproved = p.value === "Aprovada";
                    const isPending = p.value === "Pendente";
                    return (
                        <div className="flex items-center justify-center h-full w-full">
                            <div
                                className={twMerge(
                                    "flex items-center gap-1.5 justify-center max-w-32 py-1.5 w-full text-center px-3 rounded-md text-xs font-semibold",
                                    isApproved
                                        ? "bg-primary/15 text-primary"
                                        : isPending
                                          ? "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                                          : "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400",
                                )}
                            >
                                {isApproved ? (
                                    <CheckIcon size={14} weight="bold" />
                                ) : isPending ? (
                                    <ClockIcon size={14} weight="bold" />
                                ) : (
                                    <XIcon size={14} weight="bold" />
                                )}
                                <span className="truncate">{p.value}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                headerName: "Usuário",
                field: "userName",
                suppressMovable: true,
                minWidth: 220,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex flex-col h-full w-full justify-center gap-0.5">
                        <p className="leading-none text-sm font-medium truncate">
                            {p.value}
                        </p>
                        <p className="text-xs text-foreground/50 truncate">
                            {p.data.userEmail}
                        </p>
                    </div>
                ),
            },
            {
                headerName: "Pagador",
                field: "payer_name",
                suppressMovable: true,
                minWidth: 200,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex flex-col h-full w-full justify-center gap-0.5">
                        <p className="leading-none text-sm font-medium truncate">
                            {p.value}
                        </p>
                        <p className="text-xs text-foreground/50 font-mono truncate">
                            {p.data.payer_document}
                        </p>
                    </div>
                ),
            },
            {
                headerName: "Gateway",
                field: "getaway",
                suppressMovable: true,
                width: 120,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <span className="px-2 py-1 bg-foreground/5 rounded text-xs font-medium uppercase truncate">
                            {p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Origem",
                field: "origin",
                suppressMovable: true,
                width: 100,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <span className="px-2 py-1 bg-foreground/5 rounded text-xs font-medium truncate">
                            {p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Aplicação",
                field: "application",
                suppressMovable: true,
                width: 120,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <span className="px-2 py-1 bg-foreground/5 rounded text-xs font-medium truncate">
                            {p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Credencial",
                field: "credential_description",
                suppressMovable: true,
                minWidth: 180,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="text-xs text-foreground/70 truncate">
                            {p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Valor",
                field: "amount",
                suppressMovable: true,
                width: 120,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <p className="font-semibold text-sm">{p.value}</p>
                    </div>
                ),
            },
            {
                headerName: "Taxa",
                field: "fee",
                suppressMovable: true,
                width: 100,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <p className="text-sm text-foreground/70">{p.value}</p>
                    </div>
                ),
            },
            {
                headerName: "Split",
                field: "split",
                suppressMovable: true,
                width: 100,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <p className="text-sm text-foreground/70">{p.value}</p>
                    </div>
                ),
            },
            {
                headerName: "Descrição",
                field: "description",
                flex: 1,
                minWidth: 120,
                suppressMovable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <p className="text-xs text-foreground/60 italic truncate">
                            {p.value || "—"}
                        </p>
                    </div>
                ),
            },
            {
                headerName: "Ações",
                suppressMovable: true,
                minWidth: 100,
                maxWidth: 150,
                cellRenderer: (p: ICellRendererParams) => {
                    const transaction = p.data as Transaction;
                    const isLoading = loadingIds[transaction.id];
                    return (
                        <div className="flex items-center justify-center h-full w-full">
                            {transaction.status === "Aprovada" &&
                                transaction.origin !== "PIX" && (
                                    <Button
                                        onClick={() =>
                                            returnValue(transaction.id)
                                        }
                                        variant="destructive"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "..." : "Reembolsar"}
                                    </Button>
                                )}

                            {transaction.status === "Aprovada" &&
                                transaction.origin === "PIX" && (
                                    <Button
                                        onClick={() =>
                                            returnValue(transaction.id)
                                        }
                                        variant="destructive"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "..." : "Devolver Pix"}
                                    </Button>
                                )}

                            {transaction.status === "Pendente" && (
                                <Button
                                    onClick={() => approve(transaction.id)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "..." : "Aprovar"}
                                </Button>
                            )}
                        </div>
                    );
                },
            },
        ];
    }, [approve, returnValue, loadingIds]);

    return (
        <div className="ag-theme-quartz w-full" style={{ height: "auto" }}>
            <AgGridReact
                columnDefs={colDefs}
                domLayout="autoHeight"
                rowData={rows}
                defaultColDef={{
                    cellClass: "bg-background text-foreground",
                    minWidth: 100,
                    headerClass:
                        "bg-background text-foreground/60 font-semibold text-xs uppercase tracking-wide",
                    sortable: false,
                }}
                rowHeight={60}
                animateRows={true}
            />
        </div>
    );
};

export default TransactionsTable;
