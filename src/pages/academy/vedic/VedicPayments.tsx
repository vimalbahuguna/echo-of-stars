import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/components/academy/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, Download, DollarSign, AlertCircle, 
  CheckCircle, Clock, Calendar, Receipt, Search
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const VedicPayments: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        // Load payment history
        const { data: paymentsData, error: paymentsErr } = await (supabase as any)
          .from('pay_payments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!paymentsErr) setPayments(paymentsData || []);
      } catch (err) {
        console.error('Error loading payments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [user]);

  const filteredPayments = payments.filter(payment =>
    searchQuery === '' ||
    payment.payment_id.toString().includes(searchQuery) ||
    payment.amount.toString().includes(searchQuery)
  );

  const totalPaid = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  // Mock upcoming installments
  const upcomingInstallments = [
    { id: 1, amount: 500, dueDate: '2025-02-15', description: 'Level 2 - Month 2' },
    { id: 2, amount: 500, dueDate: '2025-03-15', description: 'Level 2 - Month 3' },
    { id: 3, amount: 500, dueDate: '2025-04-15', description: 'Level 2 - Month 4' }
  ];

  return (
    <DashboardLayout role="student">
      <div>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-stellar bg-clip-text text-transparent">
              Payments & Billing
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage your payments, view transaction history, and download invoices
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { 
              icon: DollarSign, 
              label: 'Total Paid', 
              value: `$${totalPaid.toLocaleString()}`, 
              color: 'text-green-500' 
            },
            { 
              icon: Clock, 
              label: 'Pending Payments', 
              value: pendingPayments, 
              color: 'text-orange-500' 
            },
            { 
              icon: Calendar, 
              label: 'Next Due Date', 
              value: 'Feb 15, 2025', 
              color: 'text-blue-500' 
            },
            { 
              icon: Receipt, 
              label: 'Outstanding', 
              value: '$500', 
              color: 'text-red-500' 
            }
          ].map((stat, i) => (
            <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Outstanding Balance Alert */}
        {pendingPayments > 0 && (
          <Card className="p-6 bg-orange-500/10 border-orange-500/30 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Payment Due Soon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You have {pendingPayments} pending payment(s). Please make payment to continue accessing course materials.
                </p>
                <Button>
                  Make Payment Now
                  <CreditCard className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="history" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="installments">Installment Plan</TabsTrigger>
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          </TabsList>

          {/* Payment History */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>View all your past transactions</CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading transactions...</div>
                ) : filteredPayments.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Invoice</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.payment_id}>
                          <TableCell className="font-mono text-sm">
                            #{payment.payment_id}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {payment.description || 'Course Payment'}
                          </TableCell>
                          <TableCell className="font-semibold">
                            ${parseFloat(payment.amount || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                payment.status === 'completed' ? 'default' : 
                                payment.status === 'pending' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3 mr-2" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Installment Plan */}
          <TabsContent value="installments">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Installments</CardTitle>
                    <CardDescription>Your scheduled payment plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingInstallments.map((installment, index) => {
                        const dueDate = new Date(installment.dueDate);
                        const today = new Date();
                        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        const isDueSoon = daysUntilDue <= 7;

                        return (
                          <Card key={installment.id} className={`p-4 ${isDueSoon ? 'border-orange-500/50 bg-orange-500/5' : ''}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-semibold text-lg mb-1">
                                  ${installment.amount.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {installment.description}
                                </div>
                              </div>
                              <Badge variant={index === 0 ? 'default' : 'outline'}>
                                {index === 0 ? 'Next Due' : `Due ${daysUntilDue} days`}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <Calendar className="w-4 h-4" />
                              <span>Due: {dueDate.toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}</span>
                            </div>
                            {index === 0 && (
                              <Button className="w-full">
                                Pay Now
                                <CreditCard className="w-4 h-4 ml-2" />
                              </Button>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <h3 className="font-semibold text-lg mb-4">Payment Plan Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Program Cost:</span>
                      <span className="font-semibold">$6,999</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="font-semibold text-green-500">$5,499</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining Balance:</span>
                      <span className="font-semibold text-orange-500">$1,500</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t">
                      <span className="text-muted-foreground">Monthly Installment:</span>
                      <span className="font-semibold">$500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payments Remaining:</span>
                      <span className="font-semibold">3 of 6</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Auto-Pay Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enable automatic payments for hassle-free installments
                  </p>
                  <Button variant="outline" className="w-full mb-3">
                    Enable Auto-Pay
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Payments will be automatically processed 3 days before due date
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Payment Reminders</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email Reminders</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">SMS Alerts</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">WhatsApp</span>
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Manage Preferences
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Payment Methods */}
          <TabsContent value="methods">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Payment Methods</CardTitle>
                  <CardDescription>Manage your payment cards and methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mock saved cards */}
                  <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-border/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-semibold mb-1">Visa •••• 4242</div>
                        <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                      </div>
                      <Badge variant="default">Primary</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </Card>

                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add New Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accepted Payment Methods</CardTitle>
                  <CardDescription>We support multiple payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {['Visa', 'Mastercard', 'PayPal', 'Stripe', 'American Express', 'Razorpay'].map((method) => (
                      <Card key={method} className="p-4 text-center">
                        <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
                        <div className="text-sm font-medium">{method}</div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VedicPayments;