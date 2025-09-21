import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plane, Users, Clock, Video, HelpCircle } from 'lucide-react';
import { TikTokIcon, InstagramIcon, YouTubeIcon } from '@/components/SocialIcons';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-sky rounded-full flex items-center justify-center mx-auto mb-6">
          <Plane className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">About Flight Requests</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to @ThrottleAndFlaps! Submit your dream flight routes and watch them come to life 
          in Microsoft Flight Simulator 2024.
        </p>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Submit Request</h3>
            <p className="text-muted-foreground">
              Choose your departure and arrival airports, aircraft preferences, and any special requests.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Track Progress</h3>
            <p className="text-muted-foreground">
              Watch as your request moves through the queue: Planning → Underway → Edited → Published.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Watch & Enjoy</h3>
            <p className="text-muted-foreground">
              Get notified when your flight is published on TikTok, Instagram, or YouTube!
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6" />
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">How long does it take for my flight to be completed?</h3>
            <p className="text-muted-foreground">
              Flight requests typically take 1-2 weeks to complete, depending on the queue and complexity. 
              You can track the status of your request in real-time on this site.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Can I request specific weather or time of day?</h3>
            <p className="text-muted-foreground">
              Absolutely! Include these preferences in the notes section when submitting your request. 
              I love creating flights with dramatic weather or beautiful sunset/sunrise conditions.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">What aircraft are available in MSFS 2024?</h3>
            <p className="text-muted-foreground">
              MSFS 2024 includes a wide range of aircraft from small GA planes to wide-body airliners. 
              Popular choices include the Boeing 737, Airbus A320 family, Boeing 777/787, and many more!
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Will my request definitely be completed?</h3>
            <p className="text-muted-foreground">
              While I aim to complete as many requests as possible, some may be declined due to technical 
              limitations, unavailable scenery, or queue management. You'll be notified if your request 
              cannot be completed.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">Can I submit multiple requests?</h3>
            <p className="text-muted-foreground">
              Yes, but please be reasonable! To give everyone a fair chance, try to limit yourself to 
              1-2 active requests at a time.
            </p>
          </Card>
        </div>
      </div>

      {/* About Me */}
      <Card className="p-8 mb-8 bg-gradient-runway">
        <h2 className="text-2xl font-semibold mb-4">About @ThrottleAndFlaps</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          I'm a flight simulation enthusiast who loves sharing the beauty of aviation with the world. 
          Using Microsoft Flight Simulator 2024, I create immersive flight experiences that showcase 
          stunning scenery, realistic procedures, and the joy of virtual flying. 
        </p>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          This flight request system lets my community suggest routes they'd love to see, making each 
          video a collaborative experience. Whether it's a challenging approach, a scenic route, or 
          your dream airline, I'm excited to bring your flight ideas to life!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <a href="https://tiktok.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <TikTokIcon className="w-4 h-4" />
              Follow on TikTok
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://instagram.com/throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <InstagramIcon className="w-4 h-4" />
              Follow on Instagram
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://youtube.com/@throttleandflaps" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <YouTubeIcon className="w-4 h-4" />
              Subscribe on YouTube
            </a>
          </Button>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <Button asChild size="lg">
          <Link to="/submit" className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Submit Your Flight Request
          </Link>
        </Button>
      </div>
    </div>
  );
}