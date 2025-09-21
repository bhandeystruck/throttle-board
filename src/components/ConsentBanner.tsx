import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const CONSENT_KEY = 'throttleboard-consent';
const COOKIE_PREFERENCES_KEY = 'throttleboard-cookie-preferences';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
}

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always required
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    if (!consent) {
      setShowBanner(true);
    }
    
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
    };
    
    setPreferences(allAccepted);
    localStorage.setItem(CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyEssential = {
      essential: true,
      functional: false,
      analytics: false,
    };
    
    setPreferences(onlyEssential);
    localStorage.setItem(CONSENT_KEY, 'rejected');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyEssential));
    setShowBanner(false);
  };

  const handleSavePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(CONSENT_KEY, 'custom');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    setShowBanner(false);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
      <Card className="max-w-6xl mx-auto">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-lg">We respect your privacy</h3>
                <p className="text-muted-foreground text-sm">
                  We use essential cookies to make our site work. We'd also like to set optional cookies 
                  to improve your experience and analyze site usage. You can choose which cookies to accept.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAcceptAll}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Accept All
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Cookie Preferences</DialogTitle>
                      <DialogDescription>
                        Choose which cookies you'd like to accept. Essential cookies are required for the site to function.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Essential Cookies */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="essential" className="font-medium">
                            Essential Cookies
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Required for the website to function properly. Cannot be disabled.
                          </p>
                        </div>
                        <Switch
                          id="essential"
                          checked={preferences.essential}
                          disabled={true}
                        />
                      </div>

                      {/* Functional Cookies */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="functional" className="font-medium">
                            Functional Cookies
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Enhance your experience by remembering preferences and settings.
                          </p>
                        </div>
                        <Switch
                          id="functional"
                          checked={preferences.functional}
                          onCheckedChange={(checked) => handlePreferenceChange('functional', checked)}
                        />
                      </div>

                      {/* Analytics Cookies */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="analytics" className="font-medium">
                            Analytics Cookies
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Help us understand how visitors use our website (anonymous data only).
                          </p>
                        </div>
                        <Switch
                          id="analytics"
                          checked={preferences.analytics}
                          onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => handleSavePreferences(preferences)}
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleRejectAll}
                >
                  Reject All
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Learn more in our{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                {' '}and{' '}
                <Link to="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 p-1"
              onClick={handleRejectAll}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
