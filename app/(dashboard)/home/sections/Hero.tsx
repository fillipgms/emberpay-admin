"use client";

import { DateRangeFilter } from "@/components/DateRangeFilter";
import { useSession } from "@/contexts/sessionContext";

const Hero = () => {
    const { user } = useSession();

    const showFirstAndLastName = (name: string) => {
        const nameParts = name.trim().split(" ");
        if (nameParts.length === 1) {
            return nameParts[0];
        }
        return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    };

    const dateNow = new Date();
    const timeNow = dateNow.getHours();

    const message = () => {
        if (timeNow >= 6 && timeNow < 12) {
            return "Bom Dia";
        }
        if (timeNow >= 12 && timeNow < 18) {
            return "Boa Tarde";
        }
        return "Boa Noite";
    };

    return (
        <div className="border-b-gradient">
            <section className="py-8 px-8  flex gap-8 flex-col md:flex-row md:justify-between">
                <div className="space-y-1">
                    <h1 className="font-bold text-2xl main-info-item">
                        Olá, {user?.name && showFirstAndLastName(user.name)},{" "}
                        {message()}
                    </h1>
                    <p className="text-foreground/50">
                        Vamos ver tudo o que está acontecendo entre
                    </p>
                    <DateRangeFilter />
                </div>
            </section>
        </div>
    );
};

export default Hero;
