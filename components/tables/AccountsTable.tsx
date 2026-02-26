"use client";

import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import {
    AllCommunityModule,
    type ColDef,
    ICellRendererParams,
    ModuleRegistry,
} from "ag-grid-community";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

ModuleRegistry.registerModules([AllCommunityModule]);

const VerifyBadge = ({ value }: { value: string }) => {
    const config: Record<string, { label: string; className: string }> = {
        pending: {
            label: "Pendente",
            className:
                "bg-yellow-500/15 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
        },
        approved: {
            label: "Aprovado",
            className:
                "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
        },
        rejected: {
            label: "Rejeitado",
            className:
                "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400",
        },
    };

    const status = config[value] ?? {
        label: value,
        className:
            "bg-foreground/10 text-foreground/60",
    };

    return (
        <span
            className={twMerge(
                "px-2 py-1 rounded-md text-xs font-semibold",
                status.className,
            )}
        >
            {status.label}
        </span>
    );
};

const AccountsTable = ({ accounts }: { accounts: Account[] }) => {
    const colDefs = useMemo<ColDef[]>(() => {
        return [
            {
                headerName: "ID",
                field: "id",
                pinned: "left",
                width: 80,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="font-mono text-xs text-foreground/60">
                            #{p.value}
                        </span>
                    </div>
                ),
            },
            {
                headerName: "Titular",
                field: "name",
                suppressMovable: true,
                minWidth: 240,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex flex-col h-full w-full justify-center gap-0.5">
                        <p className="leading-none text-sm font-medium truncate">
                            {p.value}
                        </p>
                        <p className="text-xs text-foreground/50 truncate">
                            {p.data.email}
                        </p>
                    </div>
                ),
            },
            {
                headerName: "Documento",
                field: "document",
                suppressMovable: true,
                minWidth: 160,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="font-mono text-xs">{p.value}</span>
                    </div>
                ),
            },
            {
                headerName: "Tipo",
                field: "type",
                suppressMovable: true,
                width: 100,
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
                headerName: "Status",
                field: "verify",
                suppressMovable: true,
                width: 130,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <VerifyBadge value={p.value} />
                    </div>
                ),
            },
            {
                headerName: "Criado em",
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
                headerName: "Ações",
                suppressMovable: true,
                minWidth: 100,
                maxWidth: 120,
                cellRenderer: (p: ICellRendererParams) => {
                    const account = p.data as Account;
                    return (
                        <div className="flex items-center justify-center h-full w-full">
                            <Link
                                href={`/accounts/${account.id}`}
                                className="
                                    inline-flex items-center justify-center h-7 px-3
                                    rounded-md text-xs font-medium
                                    bg-primary/10 text-primary
                                    hover:bg-primary/20
                                    transition-colors duration-150
                                "
                            >
                                Ver
                            </Link>
                        </div>
                    );
                },
            },
        ];
    }, []);

    return (
        <div className="ag-theme-quartz w-full" style={{ height: "auto" }}>
            <AgGridReact
                columnDefs={colDefs}
                domLayout="autoHeight"
                rowData={accounts}
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

export default AccountsTable;
