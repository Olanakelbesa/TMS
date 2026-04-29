import { Link } from "react-router-dom";
import { TrendingUp, Users, Zap, Mail, Briefcase, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden hero-gradient">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl lg:text-7xl lg:text-8xl font-bold tracking-tight text-text-primary mb-8 leading-[1.1]">
                Elite talent for <br />
                <span className="text-accent">visionary</span> companies.
              </h1>
              
              <p className="text-text-secondary text-lg lg:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
                Connect with the world's top 1% of specialist talent and build teams that define the future of your industry.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/talents/submit">
                  <Button className="h-14 px-8 rounded-xl text-base gap-2">
                    Join the Network <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/talents">
                  <Button variant="secondary" className="h-14 px-8 rounded-xl text-base">
                    Browse Talent
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Feature Grid */}
      <section className="py-24 bg-light-bg-secondary">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">Built for specialists, by specialists.</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Everything you need to showcase your expertise and find your next big challenge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="AI Matching"
              description="Our AI engine connects your specific skills with the most relevant opportunities in real-time."
            />
            <FeatureCard 
              icon={Users}
              title="Elite Network"
              description="Join a curated directory of the world's top 1% of talent across various disciplines."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Growth Path"
              description="Get personalized insights into how to level up your skills and increase your market value."
            />
          </div>
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="bg-primary rounded-3xl p-12 lg:p-20 relative overflow-hidden text-center text-white">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready to transform your career?</h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed">
                Join thousands of experts who have already found their dream roles through Talentry's exclusive network.
              </p>
              <Link to="/talents/submit">
                <Button className="bg-white text-primary hover:bg-slate-50 h-14 px-10 rounded-xl text-lg font-bold">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-xl font-bold text-text-primary tracking-tight">
                  Talentry
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                Redefining talent management for the modern era. Curated, AI-powered, and built for excellence.
              </p>
              <div className="flex gap-4">
                {[Mail, Briefcase, Users].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer">
                     <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Product</h4>
                <ul className="space-y-4 text-sm font-medium text-text-secondary">
                  <li><Link to="/talents" className="hover:text-primary transition-colors">Talent</Link></li>
                  <li><Link to="/talents/submit" className="hover:text-primary transition-colors">Join Network</Link></li>
                  <li><span className="cursor-not-allowed opacity-50">Pricing</span></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Company</h4>
                <ul className="space-y-4 text-sm font-medium text-text-secondary">
                  <li><span className="cursor-pointer hover:text-primary transition-colors">About</span></li>
                  <li><span className="cursor-pointer hover:text-primary transition-colors">Blog</span></li>
                  <li><span className="cursor-pointer hover:text-primary transition-colors">Contact</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-text-muted">
             <p>© 2026 Talentry Inc. All rights reserved.</p>
             <div className="flex gap-8">
                <span className="hover:text-text-primary cursor-pointer transition-colors">Privacy Policy</span>
                <span className="hover:text-text-primary cursor-pointer transition-colors">Terms</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="clean-card p-8 group clean-card-hover">
      <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
}
