"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export function DateRangeFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const dateStartParam = searchParams.get("dateStart");
    const dateEndParam = searchParams.get("dateEnd");

    const initialDateFrom = dateStartParam
        ? new Date(dateStartParam)
        : undefined;
    const initialDateTo = dateEndParam ? new Date(dateEndParam) : undefined;

    const handleUpdate = ({ range }: { range: { from: Date; to?: Date } }) => {
        const params = new URLSearchParams(searchParams.toString());

        const fmt = (d: Date) => d.toISOString().split("T")[0];

        params.set("dateStart", fmt(range.from));
        if (range.to) {
            params.set("dateEnd", fmt(range.to));
        } else {
            params.delete("dateEnd");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <DateRangePicker
            initialDateFrom={initialDateFrom}
            initialDateTo={initialDateTo}
            onUpdate={handleUpdate}
            align="end"
            showCompare={false}
        />
    );
}
