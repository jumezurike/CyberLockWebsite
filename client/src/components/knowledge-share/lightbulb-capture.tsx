import React, { useState, useEffect } from 'react';
import { Lightbulb, Send, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LightbulbMoment {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  author: string;
}

export default function LightbulbCapture() {
  const [isOpen, setIsOpen] = useState(false);
  const [momentContent, setMomentContent] = useState('');
  const [category, setCategory] = useState('security');
  const [moments, setMoments] = useState<LightbulbMoment[]>([]);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const categories = [
    { id: 'security', name: 'Security Insight' },
    { id: 'process', name: 'Process Improvement' },
    { id: 'technical', name: 'Technical Solution' },
    { id: 'threat', name: 'Threat Intelligence' },
    { id: 'compliance', name: 'Compliance & Regulation' },
  ];

  // Load saved moments from localStorage on component mount
  useEffect(() => {
    const savedMoments = localStorage.getItem('lightbulbMoments');
    if (savedMoments) {
      try {
        const parsedMoments = JSON.parse(savedMoments);
        // Convert string timestamps back to Date objects
        const momentsWithDateObjects = parsedMoments.map((moment: any) => ({
          ...moment,
          timestamp: new Date(moment.timestamp)
        }));
        setMoments(momentsWithDateObjects);
      } catch (e) {
        console.error('Error parsing saved moments:', e);
      }
    }
  }, []);

  // Save moments to localStorage whenever they change
  useEffect(() => {
    if (moments.length > 0) {
      localStorage.setItem('lightbulbMoments', JSON.stringify(moments));
    }
  }, [moments]);

  const handleSubmit = () => {
    if (!momentContent.trim()) {
      setNotification({
        show: true,
        message: 'Please enter your insight before submitting'
      });
      setTimeout(() => setNotification({ show: false, message: '' }), 3000);
      return;
    }

    setIsSubmitting(true);

    // Simulate API submission
    setTimeout(() => {
      const newMoment: LightbulbMoment = {
        id: Date.now().toString(),
        content: momentContent,
        category,
        timestamp: new Date(),
        author: 'Current User' // In a real app, get from authentication
      };

      setMoments(prev => [newMoment, ...prev]);
      setSuccessAnimation(true);

      setTimeout(() => {
        setSuccessAnimation(false);
        setIsSubmitting(false);
        setMomentContent('');
        // Keep the form open for additional entries
      }, 2000);
    }, 1000); // Simulate network delay
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset form when opening
      setMomentContent('');
      setCategory('security');
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    const foundCategory = categories.find(c => c.id === categoryId);
    return foundCategory ? foundCategory.name : categoryId;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 p-3 rounded-lg bg-red-100 text-red-800 text-sm shadow-md"
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capture button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`flex items-center justify-center rounded-full p-3 shadow-lg ${
          isOpen ? 'bg-red-500 text-white' : 'bg-amber-400 text-white'
        }`}
        aria-label={isOpen ? "Close knowledge capture" : "Open knowledge capture"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <Lightbulb className="h-6 w-6" />
            {/* Pulse animation when closed */}
            <span className="absolute inset-0 rounded-full animate-ping bg-amber-300 opacity-75"></span>
          </div>
        )}
      </motion.button>

      {/* Capture interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-16 right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white">
              <h3 className="font-semibold text-lg flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Capture Your Insight
              </h3>
              <p className="text-sm mt-1 text-amber-100">
                Share your "lightbulb moment" to help improve our collective knowledge
              </p>
            </div>

            <div className="p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                  disabled={isSubmitting}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Insight
                </label>
                <textarea
                  value={momentContent}
                  onChange={(e) => setMomentContent(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Describe your insight or discovery..."
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md flex items-center justify-center font-medium transition-colors ${
                  successAnimation
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  successAnimation ? (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Captured!
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  )
                ) : (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Insight
                  </span>
                )}
              </button>
            </div>

            {/* Recent insights */}
            {moments.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Recent Insights
                </h4>
                <div className="max-h-52 overflow-y-auto">
                  {moments.slice(0, 3).map((moment) => (
                    <div key={moment.id} className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-100">
                      <p className="text-sm text-gray-800">{moment.content}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {getCategoryLabel(moment.category)}
                        </span>
                        <span>{formatDate(moment.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                  {moments.length > 3 && (
                    <button className="text-amber-500 hover:text-amber-600 text-sm font-medium py-1">
                      View all ({moments.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}