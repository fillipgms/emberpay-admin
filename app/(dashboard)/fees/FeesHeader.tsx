"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import FeeFormModal from "./FeeFormModal";

const FeesHeader = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <section className="py-5 px-8 flex items-center justify-between w-full border-b-gradient bg-background z-50">
                <p className="font-semibold text-lg">Taxas</p>
                <button
                    onClick={() => setOpen(true)}
                    className="
                        inline-flex items-center gap-2 h-9 px-4
                        rounded-lg text-sm font-medium
                        bg-primary text-primary-foreground
                        hover:bg-primary/90
                        transition-colors duration-150
                    "
                >
                    <PlusIcon size={14} weight="bold" />
                    Nova Taxa
                </button>
            </section>

            <FeeFormModal open={open} onOpenChange={setOpen} />
        </>
    );
};

export default FeesHeader;
