"use server";

import axios from "axios";
import { getSession } from "./auth";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";
import { redirect } from "next/navigation";

export async function getDashboardData(dateStart?: string, dateEnd?: string) {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }
    const params = new URLSearchParams();
    if (dateStart) params.append("dateStart", dateStart);
    if (dateEnd) params.append("dateEnd", dateEnd);

    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/dashboard?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return res.data;
    } catch (error) {
        const apiMessage = (error as { response?: { data?: { msg?: string } } })
            ?.response?.data?.msg;
        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            redirect("/login");
        }

        throw Error(
            apiMessage ||
                getFriendlyHttpErrorMessage(
                    error,
                    "Houve um erro, tente novamente",
                ),
        );
    }
}
