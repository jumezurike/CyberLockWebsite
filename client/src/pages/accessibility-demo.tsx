import { useState } from "react";
import { 
  AccessibleAnimation, 
  AccessibleLoader, 
  AccessibleProgressIndicator, 
  AccessibleFadeIn 
} from "@/components/ui/accessible-animation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AccessibilityDemo() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progress, setProgress] = useState(25);
  const [showDelayedContent, setShowDelayedContent] = useState(false);

  const incrementProgress = () => {
    setProgress(prev => (prev + 10) % 110);
  };

  const toggleDelayedContent = () => {
    setShowDelayedContent(prev => !prev);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Accessibility Enhancement Demo</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-4">
          This page demonstrates the screen reader friendly animations implemented in CyberLockX.
          These animations respect user preferences and provide proper ARIA attributes for assistive technologies.
        </p>
        
        <div className="flex items-center gap-2 mb-8">
          <Switch 
            id="reduce-motion" 
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
          />
          <Label htmlFor="reduce-motion">Simulate reduced motion preference</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Loading Animation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Loading Indicators</CardTitle>
            <CardDescription>
              Accessible loading spinners with proper ARIA attributes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="flex gap-4 items-center">
              <AccessibleLoader 
                size="sm" 
                label="Small loader" 
                reduceMotion={reduceMotion}
              />
              <AccessibleLoader 
                size="md" 
                label="Medium loader" 
                reduceMotion={reduceMotion}
              />
              <AccessibleLoader 
                size="lg" 
                label="Large loader" 
                reduceMotion={reduceMotion}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              These loaders announce their status to screen readers
            </p>
          </CardContent>
        </Card>

        {/* Progress Indicator Card */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Indicators</CardTitle>
            <CardDescription>
              Accessible progress bars with ARIA attributes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccessibleProgressIndicator 
              value={progress} 
              max={100}
              label="Loading data" 
              reduceMotion={reduceMotion}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4">
              Current progress: {progress}%
            </p>
            <Button onClick={incrementProgress} className="w-full">
              Increment Progress
            </Button>
          </CardContent>
        </Card>

        {/* Fade In Animation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Fade In Animations</CardTitle>
            <CardDescription>
              Content that fades in with proper accessibility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={toggleDelayedContent} 
              className="w-full mb-4"
            >
              {showDelayedContent ? "Hide" : "Show"} Content
            </Button>
            
            {showDelayedContent && (
              <div className="space-y-4">
                <AccessibleFadeIn 
                  delay={0} 
                  reduceMotion={reduceMotion}
                  description="First item has appeared"
                >
                  <Card>
                    <CardContent className="p-4">
                      <p>First item (no delay)</p>
                    </CardContent>
                  </Card>
                </AccessibleFadeIn>
                
                <AccessibleFadeIn 
                  delay={300} 
                  reduceMotion={reduceMotion}
                  description="Second item has appeared"
                >
                  <Card>
                    <CardContent className="p-4">
                      <p>Second item (300ms delay)</p>
                    </CardContent>
                  </Card>
                </AccessibleFadeIn>
                
                <AccessibleFadeIn 
                  delay={600} 
                  reduceMotion={reduceMotion}
                  description="Third item has appeared"
                >
                  <Card>
                    <CardContent className="p-4">
                      <p>Third item (600ms delay)</p>
                    </CardContent>
                  </Card>
                </AccessibleFadeIn>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Animation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Animations</CardTitle>
            <CardDescription>
              Custom animations with screen reader support
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AccessibleAnimation
              animationClass="animate-pulse"
              ariaLabel="Attention required"
              description="This element is pulsing to draw attention"
              reduceMotion={reduceMotion}
              className="w-full mb-4"
            >
              <Card className="border-primary">
                <CardContent className="p-4">
                  <p className="font-medium">Important information</p>
                  <p className="text-sm text-muted-foreground">
                    This card pulses to get attention but won't distract screen reader users
                  </p>
                </CardContent>
              </Card>
            </AccessibleAnimation>

            <AccessibleAnimation
              animationClass="animate-slideInFromRight"
              ariaLabel="Slide in animation"
              description="Content has slid in from the right"
              reduceMotion={reduceMotion}
              className="w-full"
            >
              <Card>
                <CardContent className="p-4">
                  <p>This slides in from the right</p>
                </CardContent>
              </Card>
            </AccessibleAnimation>
          </CardContent>
        </Card>

        {/* Implementation Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Details</CardTitle>
            <CardDescription>
              How these accessible animations work
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>Respects user's prefers-reduced-motion setting</li>
              <li>Provides proper ARIA attributes for screen readers</li>
              <li>Includes descriptive text that's only visible to screen readers</li>
              <li>Animations can be toggled on/off for testing</li>
              <li>Uses semantic HTML with appropriate roles</li>
            </ul>
          </CardContent>
        </Card>

        {/* Accessibility Benefits Card */}
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Benefits</CardTitle>
            <CardDescription>
              How these components improve accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-disc pl-5 space-y-2">
              <li>Users with vestibular disorders aren't disoriented by animations</li>
              <li>Screen reader users receive appropriate announcements</li>
              <li>Keyboard users can navigate without visual confusion</li>
              <li>Loading states are properly communicated to all users</li>
              <li>Compliant with WCAG 2.1 guidelines</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}