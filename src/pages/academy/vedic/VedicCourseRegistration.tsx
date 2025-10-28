import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import VedicAcademyHeader from '@/components/academy/VedicAcademyHeader';
import VedicAcademyFooter from '@/components/academy/VedicAcademyFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Check, ChevronRight, ChevronLeft, CreditCard, 
  ShoppingCart, Sparkles, Award, Clock, DollarSign 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
  savings?: number;
  duration: string;
  levels: number[];
  benefits: string[];
};

const VedicCourseRegistration: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: '',
    agreeTerms: false
  });
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'installment'>('full');
  const [discountCode, setDiscountCode] = useState('');

  const packages: Package[] = [
    {
      id: 'complete',
      name: 'Complete Program',
      description: 'All 4 levels from Foundation to Master',
      price: 6999,
      savings: 1200,
      duration: '30 months',
      levels: [1, 2, 3, 4],
      benefits: [
        'All 4 certification levels',
        '20% discount on total price',
        'Lifetime platform access',
        'Priority mentorship',
        'Career placement support'
      ]
    },
    {
      id: 'level-by-level',
      name: 'Level by Level',
      description: 'Pay as you progress through each level',
      price: 8199,
      duration: 'Flexible',
      levels: [],
      benefits: [
        'Start with any level',
        'Flexible payment schedule',
        'Progress at your own pace',
        'Standard mentorship',
        'Course materials included'
      ]
    },
    {
      id: 'fast-track',
      name: 'Fast Track Program',
      description: 'Intensive 18-month accelerated program',
      price: 8499,
      duration: '18 months',
      levels: [1, 2, 3, 4],
      benefits: [
        'Complete in 18 months',
        'Weekly live sessions',
        'Dedicated mentor',
        'Fast-track certification',
        'Premium career support'
      ]
    }
  ];

  const handleNext = () => {
    if (step === 1 && !selectedPackage) {
      toast({ title: 'Please select a package', variant: 'destructive' });
      return;
    }
    if (step === 2) {
      if (!formData.firstName || !formData.email || !formData.agreeTerms) {
        toast({ title: 'Please complete all required fields', variant: 'destructive' });
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    toast({
      title: 'Enrollment Successful!',
      description: 'Redirecting to your dashboard...'
    });
    setTimeout(() => {
      navigate('/academy/vedic/student');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <VedicAcademyHeader />
      
      <main className="container mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            {['Choose Package', 'Personal Info', 'Payment', 'Confirmation'].map((label, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 ${
                  step > i + 1 ? 'bg-primary text-primary-foreground' : 
                  step === i + 1 ? 'bg-primary/20 text-primary border-2 border-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <div className={`text-sm font-medium ${step === i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </div>
              </div>
            ))}
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>

        {/* Step 1: Choose Package */}
        {step === 1 && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Choose Your Learning Path</h1>
              <p className="text-lg text-muted-foreground">
                Select the package that best fits your learning goals and schedule
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all hover:shadow-2xl ${
                    selectedPackage?.id === pkg.id ? 'border-primary border-2 shadow-xl' : 'border-border'
                  }`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <CardHeader>
                    {pkg.id === 'complete' && (
                      <Badge className="w-fit mb-2 bg-primary">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-primary mb-2">
                        ${pkg.price.toLocaleString()}
                      </div>
                      {pkg.savings && (
                        <Badge variant="secondary">Save ${pkg.savings}</Badge>
                      )}
                    </div>
                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{pkg.duration}</span>
                      </div>
                      {pkg.levels.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span>{pkg.levels.length} Certification Levels</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 mb-6">
                      {pkg.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full" 
                      variant={selectedPackage?.id === pkg.id ? 'default' : 'outline'}
                    >
                      {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Please provide your details to create your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input 
                      id="whatsapp" 
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="United States"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({...formData, agreeTerms: !!checked})}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the Terms and Conditions, Privacy Policy, and Refund Policy of SOS Vedic Academy
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && selectedPackage && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Choose your payment method and complete the transaction</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="mb-3 block">Payment Plan</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Card 
                          className={`p-4 cursor-pointer ${paymentPlan === 'full' ? 'border-primary border-2' : 'border-border'}`}
                          onClick={() => setPaymentPlan('full')}
                        >
                          <div className="font-semibold mb-1">Full Payment</div>
                          <div className="text-2xl font-bold text-primary">
                            ${selectedPackage.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">Pay once, save more</div>
                        </Card>
                        <Card 
                          className={`p-4 cursor-pointer ${paymentPlan === 'installment' ? 'border-primary border-2' : 'border-border'}`}
                          onClick={() => setPaymentPlan('installment')}
                        >
                          <div className="font-semibold mb-1">Installments</div>
                          <div className="text-2xl font-bold text-primary">
                            ${Math.round(selectedPackage.price / 6).toLocaleString()}/mo
                          </div>
                          <div className="text-sm text-muted-foreground mt-2">6 monthly payments</div>
                        </Card>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount Code</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="discount" 
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="Enter code"
                        />
                        <Button variant="outline">Apply</Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="text-center text-muted-foreground mb-4">
                        <CreditCard className="w-12 h-12 mx-auto mb-2 text-primary" />
                        <p className="text-sm">Payment gateway integration coming soon</p>
                        <p className="text-xs">Stripe, PayPal, Razorpay supported</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium mb-2">{selectedPackage.name}</div>
                      <Badge variant="outline">{selectedPackage.duration}</Badge>
                    </div>
                    <div className="space-y-2 py-4 border-y text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${selectedPackage.price.toLocaleString()}</span>
                      </div>
                      {selectedPackage.savings && (
                        <div className="flex justify-between text-green-500">
                          <span>Savings</span>
                          <span>-${selectedPackage.savings}</span>
                        </div>
                      )}
                      {discountCode && (
                        <div className="flex justify-between text-green-500">
                          <span>Discount</span>
                          <span>-$100</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${selectedPackage.price.toLocaleString()}</span>
                    </div>
                    {paymentPlan === 'installment' && (
                      <div className="text-xs text-muted-foreground">
                        6 monthly payments of ${Math.round(selectedPackage.price / 6).toLocaleString()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && selectedPackage && (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Enrollment Successful!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Welcome to SOS Vedic Academy! Your journey begins now.
              </p>
              <Card className="p-6 bg-primary/5 border-primary/30 text-left mb-8">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrollment ID:</span>
                    <span className="font-mono font-semibold">SVA-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Package:</span>
                    <span className="font-semibold">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-semibold">{formData.email}</span>
                  </div>
                </div>
              </Card>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Next Steps:</h3>
                <div className="space-y-3 text-sm text-left">
                  {[
                    'Check your email for login credentials and welcome materials',
                    'Complete your profile setup in the student dashboard',
                    'Join the orientation session scheduled for next week',
                    'Download the SOS Astro mobile app for on-the-go learning'
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button size="lg" className="mt-8" onClick={handleSubmit}>
                Go to Dashboard
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="max-w-4xl mx-auto flex justify-between mt-12">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext}>
              {step === 3 ? 'Complete Payment' : 'Continue'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>

      <VedicAcademyFooter />
    </div>
  );
};

export default VedicCourseRegistration;