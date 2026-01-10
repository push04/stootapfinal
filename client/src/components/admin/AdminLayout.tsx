import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Users,
    ShoppingCart,
    MessageSquare,
    Building2,
    Briefcase,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    Bell,
    Search,
    Moon,
    Sun,
    Rocket,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    onLogout: () => void;
}

const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "services", label: "Services", icon: Package },
    { id: "categories", label: "Categories", icon: FolderTree },
    { id: "users", label: "Users", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingCart, badge: true },
    { id: "leads", label: "Leads", icon: MessageSquare },
    { id: "opportunities", label: "Opportunities", icon: Briefcase },
    { id: "companies", label: "Companies", icon: Building2 },
    { id: "startups", label: "Startup Inquiries", icon: Rocket },
    { id: "settings", label: "Settings", icon: Settings },
];

function SidebarContent({
    activeTab,
    setActiveTab,
    collapsed,
    setCollapsed,
    onLogout,
    pendingCount = 0,
}: SidebarProps & { pendingCount?: number }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn(
                "flex items-center h-16 px-4 border-b border-zinc-200 dark:border-zinc-800",
                collapsed ? "justify-center" : "gap-3"
            )}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">S</span>
                </div>
                {!collapsed && (
                    <div>
                        <h1 className="font-bold text-lg text-zinc-900 dark:text-white">Stootap</h1>
                        <p className="text-xs text-muted-foreground">Admin Panel</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.id}
                            variant={activeTab === item.id ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 h-11 relative",
                                activeTab === item.id && "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-medium",
                                collapsed && "justify-center px-2"
                            )}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 shrink-0",
                                activeTab === item.id ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground"
                            )} />
                            {!collapsed && <span>{item.label}</span>}
                            {item.badge && pendingCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className={cn(
                                        "h-5 min-w-[20px] px-1.5 text-xs",
                                        collapsed ? "absolute -top-1 -right-1" : "ml-auto"
                                    )}
                                >
                                    {pendingCount}
                                </Badge>
                            )}
                        </Button>
                    ))}
                </nav>
            </ScrollArea>

            <Separator />

            {/* Bottom Section */}
            <div className="p-4 space-y-2">
                <Button
                    variant="ghost"
                    className={cn("w-full justify-start gap-3 h-11", collapsed && "justify-center px-2")}
                    onClick={toggleTheme}
                >
                    {theme === "light" ? (
                        <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    {!collapsed && <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
                </Button>

                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start gap-3 h-11 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
                        collapsed && "justify-center px-2"
                    )}
                    onClick={onLogout}
                >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span>Logout</span>}
                </Button>

                {/* Collapse Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("w-full mt-4", collapsed && "p-2")}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Collapse
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    pendingCount?: number;
}

export function AdminLayout({
    children,
    activeTab,
    setActiveTab,
    onLogout,
    pendingCount = 0,
}: AdminLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const currentItem = sidebarItems.find(item => item.id === activeTab);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-40 h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 hidden lg:block",
                    collapsed ? "w-[72px]" : "w-64"
                )}
            >
                <SidebarContent
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    onLogout={onLogout}
                    pendingCount={pendingCount}
                />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <SidebarContent
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            setMobileOpen(false);
                        }}
                        collapsed={false}
                        setCollapsed={() => { }}
                        onLogout={onLogout}
                        pendingCount={pendingCount}
                    />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className={cn(
                "transition-all duration-300",
                collapsed ? "lg:ml-[72px]" : "lg:ml-64"
            )}>
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Button */}
                            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                            </Sheet>

                            {/* Page Title */}
                            <div>
                                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                                    {currentItem?.label || "Dashboard"}
                                </h1>
                                <p className="text-sm text-muted-foreground hidden sm:block">
                                    Manage your platform
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="hidden md:flex items-center">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        className="w-64 pl-9 bg-zinc-100 dark:bg-zinc-800 border-0"
                                    />
                                </div>
                            </div>

                            {/* Theme Toggle */}
                            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:flex">
                                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            </Button>

                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="h-5 w-5" />
                                        {pendingCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                                {pendingCount > 9 ? "9+" : pendingCount}
                                            </span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No new notifications
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2 px-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-orange-500 text-white text-sm">A</AvatarFallback>
                                        </Avatar>
                                        <span className="hidden sm:inline font-medium">Admin</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onLogout} className="text-red-600">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export { sidebarItems };
