"use client";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon, XIcon } from "@phosphor-icons/react";

type FilterItem = { value: string; label: string };

const FilterCombobox = ({
    items,
    param,
    onValueChange,
}: {
    items: FilterItem[];
    param: string;
    onValueChange: (param: string, value: string) => void;
}) => (
    <Combobox
        items={items}
        itemToStringValue={(item: FilterItem) => item.label}
        defaultValue={items[0]}
        onValueChange={(item: FilterItem | null) =>
            onValueChange(param, item?.value ?? "")
        }
    >
        <ComboboxInput
            placeholder="Selecione..."
            className="
                h-9 px-3 w-full rounded-lg text-sm
                bg-[oklch(from_var(--background)_calc(l+0.06)_c_h)]
                border border-[oklch(from_var(--foreground)_l_c_h_/_0.08)]
                text-foreground placeholder:text-[oklch(from_var(--foreground)_l_c_h_/_0.35)]
                hover:border-[oklch(from_var(--primary)_l_c_h_/_0.4)]
                focus:border-[oklch(from_var(--primary)_l_c_h_/_0.7)]
                focus:shadow-[0_0_0_2px_oklch(from_var(--primary)_l_c_h_/_0.15)]
                transition-all duration-200 outline-none
            "
        />
        <ComboboxContent
            className="
            rounded-xl border border-[oklch(from_var(--foreground)_l_c_h_/_0.08)]
            bg-[oklch(from_var(--background)_calc(l+0.05)_c_h)]
            shadow-[0_16px_40px_oklch(0_0_0_/_0.5)]
            backdrop-blur-xl
        "
        >
            <ComboboxEmpty className="text-sm text-[oklch(from_var(--foreground)_l_c_h_/_0.4)] py-6 text-center">
                Sem resultados.
            </ComboboxEmpty>
            <ComboboxList className="p-1">
                {(item: FilterItem) => (
                    <ComboboxItem
                        key={item.value}
                        value={item}
                        className="
                            rounded-lg px-3 py-2 text-sm cursor-pointer
                            text-[oklch(from_var(--foreground)_l_c_h_/_0.8)]
                            hover:bg-[oklch(from_var(--primary)_l_c_h_/_0.12)]
                            hover:text-foreground
                            data-[selected=true]:bg-[oklch(from_var(--primary)_l_c_h_/_0.15)]
                            data-[selected=true]:text-primary
                            transition-colors duration-150
                        "
                    >
                        {item.label}
                    </ComboboxItem>
                )}
            </ComboboxList>
        </ComboboxContent>
    </Combobox>
);

const booleanItems: FilterItem[] = [
    { value: "all", label: "Todos" },
    { value: "true", label: "Sim" },
    { value: "false", label: "Não" },
];

const FilterLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xs font-medium uppercase tracking-widest text-[oklch(from_var(--foreground)_l_c_h_/_0.4)] mb-2 select-none">
        {children}
    </p>
);

const FilterGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col min-w-[140px]">{children}</div>
);

const UserFilters = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchValue, setSearchValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

    const handleUpdateFilters = (param: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "" || !value || value === "all") {
            params.delete(param);
        } else {
            params.set(param, value);
        }
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            setIsSearching(true);
            const params = new URLSearchParams(searchParams?.toString() || "");
            if (value.trim()) {
                params.set("search", value.trim());
            } else {
                params.delete("search");
            }
            params.set("page", "1");
            router.push(`/users?${params.toString()}`);
            setTimeout(() => setIsSearching(false), 100);
        }, 500);
    };

    const clearSearch = () => {
        setSearchValue("");
        handleSearch("");
    };

    return (
        <section
            className="
                relative w-full z-50
                border-b border-[oklch(from_var(--foreground)_l_c_h_/_0.06)]
                bg-[oklch(from_var(--background)_calc(l+0.02)_c_h)]
            "
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(from_var(--primary)_l_c_h_/_0.35)] to-transparent" />

            <div className="px-8 py-5 flex items-end gap-6 flex-wrap">
                <div className="flex items-center gap-2 self-end pb-[9px] text-[oklch(from_var(--foreground)_l_c_h_/_0.3)] shrink-0">
                    <FunnelIcon size={15} weight="bold" />
                    <span className="text-xs font-semibold uppercase tracking-widest">
                        Filtros
                    </span>
                </div>

                <div className="self-stretch w-px bg-[oklch(from_var(--foreground)_l_c_h_/_0.07)] shrink-0" />

                <FilterGroup>
                    <FilterLabel>Depósito</FilterLabel>
                    <FilterCombobox
                        items={booleanItems}
                        param="enabled_deposit"
                        onValueChange={handleUpdateFilters}
                    />
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Saque</FilterLabel>
                    <FilterCombobox
                        items={booleanItems}
                        param="enabled_withdraw"
                        onValueChange={handleUpdateFilters}
                    />
                </FilterGroup>

                <FilterGroup>
                    <FilterLabel>Aprovação Auto</FilterLabel>
                    <FilterCombobox
                        items={booleanItems}
                        param="auto_approve_withdrawal"
                        onValueChange={handleUpdateFilters}
                    />
                </FilterGroup>

                <div className="self-stretch w-px bg-[oklch(from_var(--foreground)_l_c_h_/_0.07)] shrink-0" />

                <div className="ml-auto self-end flex flex-col flex-1">
                    <FilterLabel>Pesquisar</FilterLabel>
                    <div className="relative group w-full">
                        <MagnifyingGlassIcon
                            size={14}
                            className="
                                absolute left-3 top-1/2 -translate-y-1/2
                                text-[oklch(from_var(--foreground)_l_c_h_/_0.3)]
                                group-focus-within:text-primary
                                transition-colors duration-200
                                pointer-events-none
                            "
                        />
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Pesquisar usuários..."
                            className="
                                h-9 pl-8 pr-8 w-full rounded-lg text-sm
                                bg-[oklch(from_var(--background)_calc(l+0.06)_c_h)]
                                border border-[oklch(from_var(--foreground)_l_c_h_/_0.08)]
                                text-foreground placeholder:text-[oklch(from_var(--foreground)_l_c_h_/_0.35)]
                                hover:border-[oklch(from_var(--primary)_l_c_h_/_0.4)]
                                focus:border-[oklch(from_var(--primary)_l_c_h_/_0.7)]
                                focus:shadow-[0_0_0_2px_oklch(from_var(--primary)_l_c_h_/_0.15)]
                                transition-all duration-200 outline-none
                            "
                        />

                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                            {isSearching ? (
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                            ) : searchValue ? (
                                <button
                                    onClick={clearSearch}
                                    className="
                                        text-[oklch(from_var(--foreground)_l_c_h_/_0.3)]
                                        hover:text-foreground
                                        transition-colors duration-150
                                    "
                                >
                                    <XIcon size={13} weight="bold" />
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserFilters;
