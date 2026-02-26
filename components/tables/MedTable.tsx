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
import { revertMed, finishMed } from "@/actions/med";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

ModuleRegistry.registerModules([AllCommunityModule]);

const MedTable = ({ items }: { items: MedItem[] }) => {
    const router = useRouter();
    const [loadingIds, setLoadingIds] = useState<Record<number, boolean>>({});
    const [rows, setRows] = useState(items);

    const setLoading = (id: number, val: boolean) =>
        setLoadingIds((prev) => ({ ...prev, [id]: val }));

    const handleRevert = useCallback(
        async (id: number) => {
            setLoading(id, true);
            try {
                const res = await revertMed(id);
                if (res?.success) {
                    toast.success("MED revertido com sucesso.");
                    router.refresh();
                } else {
                    toast.error(res?.msg ?? "Erro ao reverter MED.");
                }
            } catch {
                toast.error("Erro inesperado. Tente novamente.");
            } finally {
                setLoading(id, false);
            }
        },
        [router],
    );

    const handleFinish = useCallback(async (id: number) => {
        setLoading(id, true);
        try {
            const res = await finishMed(id);
            if (res?.success) {
                toast.success("MED finalizado com sucesso.");
                setRows((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, status: "Finalizado" } : item,
                    ),
                );
            } else {
                toast.error(res?.msg ?? "Erro ao finalizar MED.");
            }
        } catch {
            toast.error("Erro inesperado. Tente novamente.");
        } finally {
            setLoading(id, false);
        }
    }, []);

    const colDefs = useMemo<ColDef[]>(() => {
        return [
            {
                headerName: "ID",
                field: "id",
                pinned: "left",
                sortable: true,
                width: 80,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="font-mono text-xs">{p.value}</span>
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
                headerName: "Status",
                field: "status",
                suppressMovable: true,
                minWidth: 130,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => {
                    const isApproved =
                        p.value === "Aprovadas" || p.value === "Aprovada";
                    const isPending =
                        p.value === "Pendente" || p.value === "Pendentes";
                    return (
                        <div className="flex items-center justify-center h-full w-full">
                            <div
                                className={twMerge(
                                    "flex items-center gap-1.5 justify-center max-w-36 py-1.5 w-full text-center px-3 rounded-md text-xs font-semibold",
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
                headerName: "ID Transação",
                field: "id_transaction",
                suppressMovable: true,
                minWidth: 220,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="font-mono text-xs truncate">
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
                        <p className="text-sm text-foreground/70">{p.value}</p>
                    </div>
                ),
            },
            {
                headerName: "Valor MED",
                field: "med_amount",
                suppressMovable: true,
                width: 130,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <p className="font-semibold text-sm">{p.value}</p>
                    </div>
                ),
            },
            {
                headerName: "Saque",
                field: "enabled_withdraw",
                suppressMovable: true,
                width: 100,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <span
                            className={twMerge(
                                "px-2 py-1 rounded text-xs font-medium",
                                p.value
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                    : "bg-foreground/5 text-foreground/50",
                            )}
                        >
                            {p.value ? "Sim" : "Não"}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Ações",
                suppressMovable: true,
                minWidth: 180,
                maxWidth: 220,
                cellRenderer: (p: ICellRendererParams) => {
                    const item = p.data as MedItem;
                    const isLoading = loadingIds[item.id];
                    const isApproved =
                        item.status === "Aprovadas" ||
                        item.status === "Aprovada";
                    return (
                        <div className="flex items-center justify-center gap-2 h-full w-full">
                            {isApproved && (
                                <>
                                    <Button
                                        onClick={() => handleFinish(item.id)}
                                        disabled={isLoading}
                                        size="sm"
                                    >
                                        {isLoading ? "..." : "Finalizar"}
                                    </Button>
                                    <Button
                                        onClick={() => handleRevert(item.id)}
                                        variant="destructive"
                                        disabled={isLoading}
                                        size="sm"
                                    >
                                        {isLoading ? "..." : "Reverter"}
                                    </Button>
                                </>
                            )}
                        </div>
                    );
                },
            },
        ];
    }, [handleFinish, handleRevert, loadingIds]);

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

export default MedTable;
