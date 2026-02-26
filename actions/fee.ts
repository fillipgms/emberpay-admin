"use server";

import axios from "axios";
import { getSession } from "./auth";
import { redirect } from "next/navigation";
import { getFriendlyHttpErrorMessage } from "@/lib/httpError";

export default async function getFees() {
    const session = await getSession();
    if (!session?.accessToken) {
        return null;
    }

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fee`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        });

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

        return {
            success: false,
            msg:
                apiMessage ||
                getFriendlyHttpErrorMessage(
                    error,
                    "Houve um erro, tente novamente",
                ),
        };
    }
}

export async function createFee(
    data: Omit<Fee, "id" | "created_at" | "updated_at" | "user">,
) {
    const session = await getSession();
    if (!session?.accessToken) {
        return { success: false, msg: "Não autenticado" };
    }

    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/fee`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return { success: true, data: res.data };
    } catch (error) {
        const apiMessage = (error as { response?: { data?: { msg?: string } } })
            ?.response?.data?.msg;

        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            redirect("/login");
        }

        return {
            success: false,
            msg:
                apiMessage ||
                getFriendlyHttpErrorMessage(
                    error,
                    "Houve um erro ao criar a taxa",
                ),
        };
    }
}

export async function updateFee(
    id: number,
    data: Partial<Omit<Fee, "id" | "created_at" | "updated_at" | "user">>,
) {
    const session = await getSession();
    if (!session?.accessToken) {
        return { success: false, msg: "Não autenticado" };
    }

    try {
        const res = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/fee/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return { success: true, data: res.data };
    } catch (error) {
        const apiMessage = (error as { response?: { data?: { msg?: string } } })
            ?.response?.data?.msg;

        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            redirect("/login");
        }

        return {
            success: false,
            msg:
                apiMessage ||
                getFriendlyHttpErrorMessage(
                    error,
                    "Houve um erro ao atualizar a taxa",
                ),
        };
    }
}

export async function deleteFee(id: number) {
    const session = await getSession();
    if (!session?.accessToken) {
        return { success: false, msg: "Não autenticado" };
    }

    try {
        const res = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/fee/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            },
        );

        return { success: true, data: res.data };
    } catch (error) {
        const apiMessage = (error as { response?: { data?: { msg?: string } } })
            ?.response?.data?.msg;

        if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
        ) {
            redirect("/login");
        }

        return {
            success: false,
            msg:
                apiMessage ||
                getFriendlyHttpErrorMessage(
                    error,
                    "Houve um erro ao excluir a taxa",
                ),
        };
    }
}
