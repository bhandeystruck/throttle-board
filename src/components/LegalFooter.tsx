import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { SocialIcons } from '@/components/SocialIcons';

export function LegalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">ThrottleBoard</h3>
              <p className="text-sm text-muted-foreground">
                Connecting flight simulation enthusiasts with content creators for custom flight experiences.
              </p>
            </div>
            <SocialIcons />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Flight Feed
              </Link>
              <Link 
                to="/submit" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Submit Request
              </Link>
              <Link 
                to="/about" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <div className="space-y-2">
              <Link 
                to="/privacy" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                to="/cookies" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} ThrottleBoard. All rights reserved.
          </div>
          <div className="text-sm text-muted-foreground">
            Built for the flight simulation community
          </div>
        </div>
      </div>
    </footer>
  );
}
