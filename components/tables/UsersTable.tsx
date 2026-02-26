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
import { CheckIcon, XIcon, ProhibitIcon } from "@phosphor-icons/react";
import Link from "next/link";

ModuleRegistry.registerModules([AllCommunityModule]);

const BooleanBadge = ({
    value,
    trueLabel,
    falseLabel,
}: {
    value: boolean;
    trueLabel?: string;
    falseLabel?: string;
}) => (
    <div
        className={twMerge(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold w-fit",
            value
                ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400",
        )}
    >
        {value ? (
            <CheckIcon size={12} weight="bold" />
        ) : (
            <XIcon size={12} weight="bold" />
        )}
        <span>{value ? (trueLabel ?? "Sim") : (falseLabel ?? "Não")}</span>
    </div>
);

const UsersTable = ({ users }: { users: AdminUser[] }) => {
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
                headerName: "Usuário",
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
                headerName: "Saldo",
                field: "balance",
                suppressMovable: true,
                minWidth: 130,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <p className="font-semibold text-sm">R$ {p.value}</p>
                    </div>
                ),
            },
            {
                headerName: "Total Entradas",
                field: "total_in",
                suppressMovable: true,
                minWidth: 140,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            R$ {p.value}
                        </p>
                    </div>
                ),
            },
            {
                headerName: "Total Saídas",
                field: "total_out",
                suppressMovable: true,
                minWidth: 140,
                sortable: true,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-end h-full w-full pr-2">
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                            R$ {p.value}
                        </p>
                    </div>
                ),
            },
            {
                headerName: "Depósito",
                field: "enabled_deposit",
                suppressMovable: true,
                width: 120,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <BooleanBadge
                            value={p.value}
                            trueLabel="Ativo"
                            falseLabel="Inativo"
                        />
                    </div>
                ),
            },
            {
                headerName: "Saque",
                field: "enabled_withdraw",
                suppressMovable: true,
                width: 120,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <BooleanBadge
                            value={p.value}
                            trueLabel="Ativo"
                            falseLabel="Inativo"
                        />
                    </div>
                ),
            },
            {
                headerName: "Aprovação Auto",
                field: "auto_approve_withdrawal",
                suppressMovable: true,
                width: 150,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        <BooleanBadge value={p.value} />
                    </div>
                ),
            },
            {
                headerName: "Banido",
                field: "ban",
                suppressMovable: true,
                width: 100,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center justify-center h-full w-full">
                        {p.value ? (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                                <ProhibitIcon size={12} weight="bold" />
                                <span>Banido</span>
                            </div>
                        ) : (
                            <span className="text-xs text-foreground/40">—</span>
                        )}
                    </div>
                ),
            },
            {
                headerName: "IP",
                field: "latest_ip",
                suppressMovable: true,
                minWidth: 130,
                cellRenderer: (p: ICellRendererParams) => (
                    <div className="flex items-center h-full w-full">
                        <span className="font-mono text-xs text-foreground/60">
                            {p.value}
                        </span>
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
                    const user = p.data as AdminUser;
                    return (
                        <div className="flex items-center justify-center h-full w-full">
                            <Link
                                href={`/users/${user.id}`}
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
                rowData={users}
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

export default UsersTable;
