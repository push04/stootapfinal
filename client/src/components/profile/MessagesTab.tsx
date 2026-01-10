import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchWithAuth } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
    MessageSquare,
    Bell,
    Plus,
    Send,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    Shield
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

interface Ticket {
    id: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
}

interface TicketReply {
    id: string;
    message: string;
    userRole: string;
    createdAt: string;
    isInternal: boolean;
}

interface MessagesTabProps {
    userId: string;
}

export function MessagesTab({ userId }: MessagesTabProps) {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [replies, setReplies] = useState<TicketReply[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    // New ticket state
    const [createTicketOpen, setCreateTicketOpen] = useState(false);
    const [newTicket, setNewTicket] = useState({
        subject: "",
        category: "general",
        message: "",
        priority: "medium"
    });
    const [creatingTicket, setCreatingTicket] = useState(false);

    useEffect(() => {
        fetchData();
    }, [userId]);

    useEffect(() => {
        if (selectedTicket) {
            fetchReplies(selectedTicket.id);
        }
    }, [selectedTicket]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [notifsRes, ticketsRes] = await Promise.all([
                fetchWithAuth(`/api/notifications/${userId}`),
                fetchWithAuth(`/api/tickets/${userId}`)
            ]);

            if (notifsRes.ok) {
                setNotifications(await notifsRes.json());
            }

            if (ticketsRes.ok) {
                setTickets(await ticketsRes.json());
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReplies = async (ticketId: string) => {
        try {
            const res = await fetchWithAuth(`/api/tickets/${ticketId}/replies`);
            if (res.ok) {
                setReplies(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch replies:", error);
        }
    };

    const handleCreateTicket = async () => {
        if (!newTicket.subject || !newTicket.message) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        setCreatingTicket(true);
        try {
            // First create the ticket
            const ticketRes = await fetchWithAuth("/api/tickets", {
                method: "POST",
                body: JSON.stringify({
                    userId,
                    subject: newTicket.subject,
                    category: newTicket.category, // Ensure category is included
                    priority: newTicket.priority,
                    status: "open"
                })
            });

            if (!ticketRes.ok) throw new Error("Failed to create ticket");

            const ticketData = await ticketRes.json();

            // Then create the initial message as a reply
            const replyRes = await fetchWithAuth(`/api/tickets/${ticketData.id}/replies`, {
                method: "POST",
                body: JSON.stringify({
                    userId,
                    message: newTicket.message,
                    userRole: "user" // Set role clearly
                })
            });

            if (!replyRes.ok) throw new Error("Failed to create initial message");

            toast({
                title: "Message Sent",
                description: "Your support request has been submitted successfully."
            });

            setCreateTicketOpen(false);
            setNewTicket({ subject: "", category: "general", message: "", priority: "medium" });
            fetchData();
        } catch (error) {
            console.error("Create ticket error:", error);
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setCreatingTicket(false);
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !replyMessage.trim()) return;

        setSendingReply(true);
        try {
            const res = await fetchWithAuth(`/api/tickets/${selectedTicket.id}/replies`, {
                method: "POST",
                body: JSON.stringify({
                    userId,
                    message: replyMessage,
                    userRole: "user"
                })
            });

            if (res.ok) {
                setReplyMessage("");
                fetchReplies(selectedTicket.id);
                toast({
                    title: "Reply Sent",
                    description: "Your reply has been sent."
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send reply",
                variant: "destructive"
            });
        } finally {
            setSendingReply(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "open":
                return <Badge className="bg-green-500">Open</Badge>;
            case "in_progress":
                return <Badge className="bg-blue-500">In Progress</Badge>;
            case "closed":
                return <Badge variant="secondary">Closed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">Loading messages...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Messages & Support</h2>
                    <p className="text-muted-foreground">
                        View notifications and manage support requests
                    </p>
                </div>
                <Dialog open={createTicketOpen} onOpenChange={setCreateTicketOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Support Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Contact Support</DialogTitle>
                            <DialogDescription>
                                Send a message to our support team. We'll get back to you as soon as possible.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Input
                                    placeholder="What is this regarding?"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={newTicket.category}
                                    onValueChange={(val) => setNewTicket({ ...newTicket, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General Inquiry</SelectItem>
                                        <SelectItem value="order">Order Issue</SelectItem>
                                        <SelectItem value="technical">Technical Support</SelectItem>
                                        <SelectItem value="billing">Billing & Payments</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea
                                    placeholder="Describe your issue or question..."
                                    rows={4}
                                    value={newTicket.message}
                                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateTicketOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateTicket} disabled={creatingTicket}>
                                {creatingTicket ? "Sending..." : "Send Message"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Sidebar List */}
                <Card className="lg:col-span-1 h-full flex flex-col">
                    <Tabs defaultValue="notifications" className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="notifications">
                                    <Bell className="h-4 w-4 mr-2" />
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger value="tickets">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Support
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="notifications" className="flex-1 p-0 m-0 relative">
                            <ScrollArea className="h-full">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No new notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} className={`p-4 hover:bg-muted/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}>
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-semibold text-sm">{notif.title}</h4>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                        {format(new Date(notif.createdAt), "MMM d")}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2">{notif.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="tickets" className="flex-1 p-0 m-0 relative">
                            <ScrollArea className="h-full">
                                {tickets.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No support tickets yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {tickets.map((ticket) => (
                                            <button
                                                key={ticket.id}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-muted' : ''}`}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-semibold text-sm truncate">{ticket.subject}</h4>
                                                    {getStatusBadge(ticket.status)}
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                                    <span className="capitalize">{ticket.category}</span>
                                                    <span>{format(new Date(ticket.updatedAt), "MMM d, h:mm a")}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </Card>

                {/* Main Content Area */}
                <Card className="lg:col-span-2 h-full flex flex-col overflow-hidden">
                    {selectedTicket ? (
                        <>
                            <CardHeader className="border-b py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {selectedTicket.subject}
                                            {getStatusBadge(selectedTicket.status)}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span className="capitalize">{selectedTicket.category}</span>
                                            <span>•</span>
                                            <span>ID: {selectedTicket.id.slice(0, 8)}</span>
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)} className="lg:hidden">
                                        Close
                                    </Button>
                                </div>
                            </CardHeader>
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {replies.map((reply) => (
                                        <div
                                            key={reply.id}
                                            className={`flex gap-3 ${reply.userRole !== 'user' ? 'flex-row' : 'flex-row-reverse'}`}
                                        >
                                            <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                        ${reply.userRole !== 'user' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                      `}>
                                                {reply.userRole !== 'user' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                            </div>
                                            <div className={`
                        max-w-[80%] rounded-lg p-3 text-sm
                        ${reply.userRole !== 'user' ? 'bg-primary/10 text-foreground' : 'bg-muted text-foreground'}
                      `}>
                                                {reply.userRole !== 'user' && (
                                                    <p className="text-xs font-semibold text-primary mb-1">Support Team</p>
                                                )}
                                                <p className="whitespace-pre-wrap">{reply.message}</p>
                                                <p className="text-[10px] opacity-70 mt-1 text-right">
                                                    {format(new Date(reply.createdAt), "MMM d, h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {replies.length === 0 && (
                                        <div className="text-center text-muted-foreground py-8">
                                            No messages in this conversation yet.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="p-4 border-t bg-muted/20">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type your reply..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                                    />
                                    <Button onClick={handleSendReply} disabled={!replyMessage.trim() || sendingReply} size="icon">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                            <div className="bg-muted/50 p-4 rounded-full mb-4">
                                <MessageSquare className="h-8 w-8 opacity-50" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
                            <p className="max-w-sm mx-auto">
                                Choose a support ticket from the list to view the conversation, or start a new request if you need help.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
