import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  fullName: string;
  email: string;
  company: string;
  message: string;
  privacyPolicy: boolean;
}

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ContactFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      message: '',
      privacyPolicy: false
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, you would send this data to your backend
      console.log('Contact form submission:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 bg-primary p-8 text-white">
              <h2 className="text-2xl font-bold font-heading mb-6">Get in Touch</h2>
              <p className="mb-6">Have questions about our secure business solutions? Our team is here to help you protect your business with CyberLockX.</p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-envelope text-accent mt-1 mr-3"></i>
                  <div>
                    <h3 className="font-medium mb-1">Email Us</h3>
                    <p className="text-neutral-100">info@cyberlockx.xyz</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-phone text-accent mt-1 mr-3"></i>
                  <div>
                    <h3 className="font-medium mb-1">Call Us</h3>
                    <p className="text-neutral-100">(763) 291-6314</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt text-accent mt-1 mr-3"></i>
                  <div>
                    <h3 className="font-medium mb-1">Visit Us</h3>
                    <p className="text-neutral-100">1225 Laurel St.<br/>Columbia, SC 29201</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold font-heading text-primary mb-6">Contact Us</h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className={`w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`} 
                      placeholder="John Doe"
                      {...register('fullName', { required: 'Full name is required' })}
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`} 
                      placeholder="john@example.com"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Company</label>
                    <input 
                      type="text" 
                      className={`w-full px-3 py-2 border ${errors.company ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`} 
                      placeholder="Your Company Name"
                      {...register('company', { required: 'Company name is required' })}
                    />
                    {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
                    <textarea 
                      rows={4} 
                      className={`w-full px-3 py-2 border ${errors.message ? 'border-red-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary`} 
                      placeholder="How can we help you?"
                      {...register('message', { required: 'Message is required' })}
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
                  </div>
                  
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      id="privacy-policy" 
                      className={`mt-1 mr-2 ${errors.privacyPolicy ? 'border-red-500' : ''}`}
                      {...register('privacyPolicy', { required: 'You must agree to the Privacy Policy' })}
                    />
                    <label htmlFor="privacy-policy" className="text-sm text-neutral-600">
                      I agree to the <a href="#" className="text-primary hover:underline">Privacy Policy</a> and consent to being contacted.
                    </label>
                  </div>
                  {errors.privacyPolicy && <p className="mt-1 text-sm text-red-600">{errors.privacyPolicy.message}</p>}
                  
                  <div>
                    <button 
                      type="submit" 
                      className="w-full bg-secondary hover:bg-orange-600 text-white py-3 rounded-md transition duration-150 ease-in-out font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
