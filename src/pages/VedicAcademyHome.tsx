import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CosmicHeader from '@/components/CosmicHeader';
import CosmicFooter from '@/components/CosmicFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, Users, BookOpen, Award, 
  Target, Calendar, Video, MessageSquare,
  UserCheck, Settings, BarChart, Star,
  TrendingUp, Globe, CheckCircle, Play,
  ChevronRight, Sparkles, Clock, DollarSign
} from 'lucide-react';

const VedicAcademyHome: React.FC = () => {
  const { t } = useTranslation();

  const certificationLevels = [
    { 
      title: 'Foundation', 
      duration: '6 months', 
      fee: '$500',
      level: 1,
      color: 'from-blue-500/10 to-purple-500/10',
      border: 'hover:border-blue-500/50',
      topics: ['Basics of Jyotish', 'Planetary Analysis', 'House Systems', 'Sign & Nakshatra Fundamentals']
    },
    { 
      title: 'Practitioner', 
      duration: '6 months', 
      fee: '$750',
      level: 2,
      color: 'from-purple-500/10 to-pink-500/10',
      border: 'hover:border-purple-500/50',
      topics: ['Advanced Techniques', 'Dasha Systems', 'Transits', 'Divisional Charts (D9, D10)']
    },
    { 
      title: 'Professional', 
      duration: '9 months', 
      fee: '$1,200',
      level: 3,
      color: 'from-pink-500/10 to-orange-500/10',
      border: 'hover:border-pink-500/50',
      topics: ['Predictive Methods', 'Remedial Measures', 'Case Studies', 'Consultation Practice']
    },
    { 
      title: 'Master', 
      duration: '9 months', 
      fee: '$1,500',
      level: 4,
      color: 'from-orange-500/10 to-yellow-500/10',
      border: 'hover:border-yellow-500/50',
      topics: ['Research Methods', 'Teaching Skills', 'Advanced Consultation', 'Thesis & Certification']
    }
  ];

  const features = [
    { icon: Video, title: 'Live Interactive Sessions', desc: 'Real-time classes with expert faculty and recorded archives' },
    { icon: BookOpen, title: 'Comprehensive Curriculum', desc: '30-month structured program with 4 certification levels' },
    { icon: Award, title: 'Industry-Recognized Certification', desc: 'Professional credentials recognized globally' },
    { icon: Users, title: 'Expert Faculty', desc: 'Learn from masters with decades of practical experience' },
    { icon: MessageSquare, title: 'Community Forum', desc: 'Engage with peers, mentors, and alumni worldwide' },
    { icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor your learning journey with detailed analytics' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <CosmicHeader />
      
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_70%)]" />
          <div className="relative z-10">
            <Badge className="mb-4 bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Vedic Astrology Education
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-stellar bg-clip-text text-transparent leading-tight">
              Master the Ancient Science
              <br />of Vedic Astrology
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Professional Certification • 30-Month Program • 4 Levels • SOS Astro Platform Integrated
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="group shadow-lg">
                <Link to="/academy/astrology/vedic/curriculum">
                  Explore Curriculum
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="shadow-lg">
                <Link to="/academy/vedic/student">
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
              {[
                { value: '30', label: 'Months Program', suffix: '+' },
                { value: '4', label: 'Certification Levels', suffix: '' },
                { value: '100', label: 'Video Lessons', suffix: '+' },
                { value: '24/7', label: 'Learning Access', suffix: '' }
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-stellar bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose SOS Vedic Academy?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience world-class education combining ancient wisdom with modern technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10 group">
                <feature.icon className="w-14 h-14 text-primary mb-5 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Certification Levels */}
        <section className="py-20">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <Award className="w-3 h-3 mr-1" />
              Four-Level Mastery Path
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Certification Levels</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Progress through four comprehensive levels from Foundation to Master
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationLevels.map((level, i) => (
              <Card key={i} className={`p-7 bg-gradient-to-br ${level.color} border-border/50 ${level.border} transition-all hover:shadow-2xl group relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/15 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <Badge className="bg-primary/10 text-primary border-primary/30">{`Level ${level.level}`}</Badge>
                    <Star className="w-6 h-6 text-primary fill-primary/20" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{level.title}</h3>
                  <div className="space-y-2 mb-5 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium">{level.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-medium">{level.fee}</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    {level.topics.slice(0, 3).map((topic, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{topic}</span>
                      </div>
                    ))}
                    {level.topics.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-6">
                        +{level.topics.length - 3} more topics
                      </div>
                    )}
                  </div>
                  <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to="/academy/astrology/vedic/syllabus">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Dashboard Access */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Access Your Dashboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your role to access the comprehensive learning platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: GraduationCap,
                title: 'Student Dashboard',
                desc: 'Track progress, access lessons, submit assignments, and engage with the community',
                link: '/academy/vedic/student',
                color: 'from-blue-500/10 to-purple-500/10',
                iconColor: 'text-blue-500'
              },
              {
                icon: Users,
                title: 'Faculty Dashboard',
                desc: 'Manage courses, sections, track student progress, and provide guidance',
                link: '/academy/vedic/faculty',
                color: 'from-purple-500/10 to-pink-500/10',
                iconColor: 'text-purple-500'
              },
              {
                icon: Settings,
                title: 'Admin Dashboard',
                desc: 'Administer academy settings, manage roles, memberships, and compliance',
                link: '/academy/vedic/admin',
                color: 'from-pink-500/10 to-orange-500/10',
                iconColor: 'text-pink-500'
              }
            ].map((dash, i) => (
              <Card key={i} className={`p-10 bg-gradient-to-br ${dash.color} border-border/50 hover:border-primary/50 transition-all hover:shadow-2xl group`}>
                <dash.icon className={`w-20 h-20 ${dash.iconColor} mb-6 group-hover:scale-110 transition-transform`} />
                <h3 className="text-2xl font-semibold mb-3">{dash.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">{dash.desc}</p>
                <Button asChild className="w-full shadow-lg group-hover:shadow-xl transition-shadow">
                  <Link to={dash.link}>
                    Access Dashboard
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-center">
          <Card className="p-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-border/50 shadow-2xl">
            <Globe className="w-20 h-20 text-primary mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Begin Your Journey Today</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of students worldwide learning authentic Vedic Astrology from traditional masters
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button asChild size="lg" className="shadow-xl">
                <Link to="/academy/astrology/vedic/curriculum">Explore Full Curriculum</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="shadow-xl">
                <Link to="/academy/astrology/vedic/about">Learn More About Us</Link>
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <CosmicFooter />
    </div>
  );
};

export default VedicAcademyHome;
