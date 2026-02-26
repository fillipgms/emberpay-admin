"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import ThemeSwitcher from "./Theme-Switcher";
import ArrowDoorOut from "@/public/icons/arrow-door-out";
import Link from "next/link";
import GridIcon from "@/public/icons/grid";
import { usePathname } from "next/navigation";
import {
    ArrowsDownUpIcon,
    IdentificationBadgeIcon,
    UserIcon,
    ShieldCheckIcon,
    HandCoinsIcon,
    ArrowUUpLeftIcon,
} from "@phosphor-icons/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CaretUpIcon } from "@phosphor-icons/react/dist/ssr";
import ConfigsModal from "./ConfigsModal";
import { logOut } from "@/actions/auth";
import { useSession } from "@/contexts/sessionContext";

const items = [
    { title: "Dashboard", url: "/", icon: GridIcon },
    { title: "Transações", url: "/transactions", icon: ArrowsDownUpIcon },
    { title: "MED", url: "/med", icon: ArrowUUpLeftIcon },
    { title: "Usuários", url: "/users", icon: IdentificationBadgeIcon },
    { title: "Contas", url: "/accounts", icon: ShieldCheckIcon },
    { title: "Taxas", url: "/fees", icon: HandCoinsIcon },
];

const AppSidebar = () => {
    const pathname = usePathname();

    const { user } = useSession();

    const handleLogout = async () => {
        await logOut();
    };

    const showFirstAndLastName = (name: string) => {
        const nameParts = name.trim().split(" ");
        if (nameParts.length === 1) {
            return nameParts[0];
        }
        return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="sr-only">
                        Main Nav
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const active = item.url === pathname;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            className={
                                                active
                                                    ? "bg-primary rounded-md text-background hover:bg-primary/50 hover:text-background"
                                                    : ""
                                            }
                                            asChild
                                        >
                                            <Link href={item.url}>
                                                <item.icon
                                                    weight={
                                                        active ? "fill" : "bold"
                                                    }
                                                />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ThemeSwitcher />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <UserIcon />{" "}
                                    {showFirstAndLastName(user?.name || "")}
                                    <CaretUpIcon className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    <ConfigsModal />
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={handleLogout}>
                                    <span className="flex items-center gap-2">
                                        <ArrowDoorOut className="text-foreground" />
                                        Sair
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarFooter />
        </Sidebar>
    );
};

export default AppSidebar;
