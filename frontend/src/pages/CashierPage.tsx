import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    Receipt,
    CreditCard,
    Clock,
    CheckCircle2,
    X,
    Search,
} from 'lucide-react';
import { TopHeader } from '@/components/TopHeader';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useBilling } from '@/hooks/useBilling';
import { useTables } from '@/hooks/useTables';
import type { Bill, Table } from '@/types';

export function CashierPage() {
    const navigate = useNavigate();
    const { tables } = useTables();
    const { loading, fetchBill, pay } = useBilling();

    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [billModalOpen, setBillModalOpen] = useState(false);
    const [paidBillIds, setPaidBillIds] = useState<Set<string>>(new Set());
    const [knownBills, setKnownBills] = useState<Record<string, Bill>>({});
    const [notice, setNotice] = useState<string | null>(null);
    const [refreshingAll, setRefreshingAll] = useState(false);

    const selectedBill = useMemo(() => {
        if (!selectedTable) return null;
        const known = knownBills[selectedTable];
        if (known && known.status === 'pending') return known;
        return null;
    }, [selectedTable, knownBills]);

    const stats = useMemo(() => {
        const bills = Object.values(knownBills);
        const unpaidBills = bills.filter(b => b.status === 'pending');
        const paidBills = bills.filter(b => b.status === 'paid');
        const unpaidTotal = unpaidBills.reduce((sum, b) => sum + b.totalAmount, 0);
        const paidTotal = paidBills.reduce((sum, b) => sum + b.totalAmount, 0);
        return {
            unpaidCount: unpaidBills.length,
            paidCount: paidBills.length,
            unpaidTotal,
            paidTotal,
        };
    }, [knownBills]);

    const formatInr = (amount: number) => `${Math.round(amount).toLocaleString('en-IN')} ₹`;

    const handleTableClick = async (table: Table) => {
        const tableId = table.tableNumber;
        setSelectedTable(tableId);
        setNotice(null);
        try {
            const fetchedBill = await fetchBill(tableId);
            setKnownBills(prev => ({ ...prev, [tableId]: fetchedBill }));
            if (fetchedBill.status === 'pending') {
                setBillModalOpen(true);
            } else {
                setNotice(`Table ${tableId} has no unpaid bill.`);
            }
        } catch {
            setNotice(`Table ${tableId} has no unpaid bill.`);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!selectedBill) return;
        try {
            const paid = await pay(selectedBill.id);
            setKnownBills(prev => ({ ...prev, [paid.tableId]: paid }));
            setPaidBillIds(prev => new Set(prev).add(paid.id));
            setBillModalOpen(false);
            setNotice(`Payment complete for Table ${paid.tableId}.`);
            toast.fire({ icon: 'success', title: `Payment complete for Table ${paid.tableId}` });
            setSelectedTable(null);
            await refreshAllTables();
        } catch (err) {
            toast.fire({ icon: 'error', title: 'Payment failed' });
        }
    };

    const refreshAllTables = async () => {
        if (tables.length === 0) return;
        setRefreshingAll(true);
        setNotice(null);
        try {
            const entries = await Promise.all(
                tables.map(async table => {
                    try {
                        const fetched = await fetchBill(table.tableNumber);
                        return [table.tableNumber, fetched] as const;
                    } catch {
                        return [table.tableNumber, null] as const;
                    }
                })
            );

            const nextKnownBills: Record<string, Bill> = {};
            entries.forEach(([tableNumber, billData]) => {
                if (billData) nextKnownBills[tableNumber] = billData;
            });
            setKnownBills(nextKnownBills);
            setNotice('Refreshed bills for all tables.');
        } finally {
            setRefreshingAll(false);
        }
    };

    useEffect(() => {
        if (tables.length > 0) {
            void refreshAllTables();
        }
        // Trigger initial sync when table list is available.
    }, [tables.length]);

    const getTableColor = (table: Table) => {
        const known = knownBills[table.tableNumber];
        if (known?.status === 'pending') {
            return 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200';
        }
        if (known?.status === 'paid' || paidBillIds.has(known?.id ?? '')) {
            return 'bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200';
        }
        return 'bg-muted/50 border-border text-muted-foreground hover:bg-muted';
    };

    const getTableLabel = (table: Table) => {
        const known = knownBills[table.tableNumber];
        if (known?.status === 'pending') return 'Unpaid';
        if (known?.status === 'paid' || paidBillIds.has(known?.id ?? '')) return 'Paid';
        return 'No bill';
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const minutes = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m ago`;
    };

    return (
        <div className="min-h-screen bg-background">
            <TopHeader title="Cashier" icon={<Receipt className="h-5 w-5" />}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void refreshAllTables()}
                    disabled={refreshingAll}
                    className="mr-2"
                >
                    {refreshingAll ? 'Refreshing...' : 'Refresh all tables'}
                </Button>
                <Badge variant="secondary" className="gap-1 mr-2">
                    <Receipt className="h-3 w-3" />
                    {stats.unpaidCount} unpaid
                </Badge>
            </TopHeader>

            <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:px-6">
                <div className="mb-6 grid grid-cols-2 gap-4">
                    <Card className="overflow-hidden border-0 bg-background/50 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-amber-100/50 to-transparent pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Clock className="h-4 w-4 text-amber-500" />
                                Pending Bills
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-3xl font-black text-amber-600">{formatInr(stats.unpaidTotal)}</p>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">{stats.unpaidCount} bills waiting</p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 bg-background/50 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-lg">
                        <CardHeader className="bg-gradient-to-br from-emerald-100/50 to-transparent pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Collected Today
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-3xl font-black text-emerald-600">{formatInr(stats.paidTotal)}</p>
                            <p className="mt-1 text-xs font-medium text-muted-foreground">{stats.paidCount} bills settled</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold text-foreground">Select a Table</h2>
                    <div className="mb-4 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-amber-400" />
                            <span className="text-sm text-muted-foreground">Unpaid ({stats.unpaidCount})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-muted" />
                            <span className="text-sm text-muted-foreground">No bill ({tables.length - stats.unpaidCount})</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {tables.map(table => {
                            const tableBill = knownBills[table.tableNumber];
                            return (
                                <button
                                    key={table.id}
                                    onClick={() => void handleTableClick(table)}
                                    className={cn(
                                        'group relative aspect-square rounded-2xl border-0 p-4 transition-all duration-300 cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-lg',
                                        'flex flex-col items-center justify-center overflow-hidden',
                                        getTableColor(table),
                                        selectedTable === table.tableNumber && 'ring-4 ring-primary/50 ring-offset-2'
                                    )}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <span className="relative text-3xl font-black tracking-tighter">{table.tableNumber}</span>
                                    <div className="relative mt-2 flex items-center gap-1 rounded-full bg-background/50 px-2 py-0.5 backdrop-blur-sm">
                                        <Users className="h-3 w-3" />
                                        <span className="text-xs font-semibold">-</span>
                                    </div>
                                    <span className="relative mt-2 text-xs font-bold uppercase tracking-wider opacity-80">{getTableLabel(table)}</span>
                                    {tableBill && (
                                        <span className="relative mt-2 rounded-lg bg-background/40 px-2 py-1 text-sm font-black shadow-sm backdrop-blur-md">
                                            {formatInr(tableBill.totalAmount)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h2 className="mb-3 text-lg font-semibold text-foreground">Unpaid Bills</h2>
                    <div className="space-y-3">
                        {Object.values(knownBills)
                            .filter(b => b.status === 'pending')
                            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                            .map(b => (
                                <Card
                                    key={b.id}
                                    className="cursor-pointer transition-shadow hover:shadow-md"
                                    onClick={() => {
                                        setSelectedTable(b.tableId);
                                        setBillModalOpen(true);
                                    }}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                                    <span className="font-bold text-amber-700">{b.tableId}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">{b.id}</p>
                                                    <p className="text-sm text-muted-foreground">{formatTime(b.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-foreground">
                                                    {formatInr(b.totalAmount)}
                                                </p>
                                                <Badge variant="outline" className="border-amber-300 text-amber-600">
                                                    Unpaid
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        {Object.values(knownBills).filter(b => b.status === 'pending').length === 0 && (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
                                    <p className="text-muted-foreground">No unpaid bills loaded yet.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
                {notice && <p className="mt-4 text-sm text-muted-foreground">{notice}</p>}
            </main>

            <Dialog open={billModalOpen} onOpenChange={setBillModalOpen}>
                <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Table {selectedBill?.tableId} - Bill #{selectedBill?.id.slice(0, 8)}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedBill ? formatTime(selectedBill.createdAt) : ''}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBill && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-muted/50 p-3">
                                <p className="text-sm text-muted-foreground">Bill total</p>
                                <p className="text-xl font-bold text-foreground">
                                    {formatInr(selectedBill.totalAmount)}
                                </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-primary">{formatInr(selectedBill.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            onClick={() => void handleMarkAsPaid()}
                            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                            size="lg"
                            disabled={!selectedBill || loading}
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Mark as Paid
                        </Button>
                        <Button variant="outline" onClick={() => setBillModalOpen(false)} className="w-full">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
