import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const upcomingEvents = [
  {
    id: 1,
    title: 'Annual CAS Conference 2024',
    date: 'September 15, 2024',
    location: 'Toronto, ON',
    description: 'Join patients, families, and healthcare professionals for our annual conference featuring the latest research and support sessions.'
  },
  {
    id: 2,
    title: 'Virtual Support Group Meeting',
    date: 'August 28, 2024',
    location: 'Online',
    description: 'Monthly virtual meeting for patients and caregivers to share experiences and connect with the community.'
  }
];

export default function EventsNewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !email) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for joining our newsletter.",
      });
      setName('');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-24 bg-[#F8FAFB]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="headline-lg mb-6">
            Stay Connected
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Join our community events and stay updated with the latest news, research, and resources.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="headline-md mb-8">Upcoming Events</h3>
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="module-card cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-[#00AFE6] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="headline-md mb-2">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-[#6B7280] mb-3">
                        <span>{event.date}</span>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="body-md mb-4">{event.description}</p>
                  <motion.div 
                    className="flex items-center text-[#00AFE6] font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="module-card">
              <h3 className="headline-md mb-6">Join Our Newsletter</h3>
              <p className="body-md mb-8">
                Stay informed about the latest research, events, and resources. Get updates delivered directly to your inbox.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="newsletter-name" className="block text-sm font-medium text-[#1F2937] mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="newsletter-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newsletter-email" className="block text-sm font-medium text-[#1F2937] mb-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}