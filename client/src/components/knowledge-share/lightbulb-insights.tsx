import React, { useState, useEffect } from 'react';
import { Lightbulb, Search, Filter, Download, Trash2 } from 'lucide-react';

interface LightbulbMoment {
  id: string;
  content: string;
  category: string;
  timestamp: Date;
  author: string;
}

export default function LightbulbInsights() {
  const [moments, setMoments] = useState<LightbulbMoment[]>([]);
  const [filteredMoments, setFilteredMoments] = useState<LightbulbMoment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'security', name: 'Cybersecurity Insight' },
    { id: 'process', name: 'Process Improvement' },
    { id: 'technical', name: 'Technical Solution' },
    { id: 'threat', name: 'Threat Intelligence' },
    { id: 'compliance', name: 'Compliance & Regulation' },
  ];

  // Load moments from localStorage on component mount
  useEffect(() => {
    const loadMoments = () => {
      setIsLoading(true);
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
          setMoments([]);
        }
      } else {
        setMoments([]);
      }
      
      setIsLoading(false);
    };

    loadMoments();
  }, []);

  // Apply filters and search whenever dependencies change
  useEffect(() => {
    let result = [...moments];
    
    // Apply category filter
    if (filterCategory !== 'all') {
      result = result.filter(moment => moment.category === filterCategory);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(moment => 
        moment.content.toLowerCase().includes(query) ||
        moment.author.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });
    
    setFilteredMoments(result);
  }, [moments, searchQuery, filterCategory, sortOrder]);

  const handleDeleteMoment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this insight?')) {
      const updatedMoments = moments.filter(moment => moment.id !== id);
      setMoments(updatedMoments);
      localStorage.setItem('lightbulbMoments', JSON.stringify(updatedMoments));
    }
  };

  const handleExportMoments = () => {
    const exportData = JSON.stringify(moments, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lightbulb-insights-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const getCategoryLabel = (categoryId: string) => {
    const foundCategory = categories.find(c => c.id === categoryId);
    return foundCategory ? foundCategory.name : categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    switch(categoryId) {
      case 'security': return 'bg-blue-100 text-blue-700';
      case 'process': return 'bg-green-100 text-green-700';
      case 'technical': return 'bg-purple-100 text-purple-700';
      case 'threat': return 'bg-red-100 text-red-700';
      case 'compliance': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto max-w-5xl p-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-amber-600">
            <Lightbulb className="h-6 w-6 mr-2" />
            Lightbulb Insights
          </h1>
          <p className="text-gray-600 mt-1">Collective knowledge from your team's discoveries</p>
        </div>
        
        <button 
          onClick={handleExportMoments}
          disabled={moments.length === 0}
          className={`mt-4 sm:mt-0 flex items-center px-4 py-2 rounded-md ${
            moments.length === 0 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          <Download className="h-4 w-4 mr-2" />
          Export Insights
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights..."
              className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-md border border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          {filteredMoments.length} {filteredMoments.length === 1 ? 'insight' : 'insights'} found
          {filterCategory !== 'all' && ` in ${getCategoryLabel(filterCategory)}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      </div>
      
      {/* Insights list */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredMoments.length > 0 ? (
        <div className="space-y-4">
          {filteredMoments.map((moment) => (
            <div 
              key={moment.id} 
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5">
                <p className="text-gray-800">{moment.content}</p>
                
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(moment.category)}`}>
                      {getCategoryLabel(moment.category)}
                    </span>
                    <span className="text-sm text-gray-500">
                      By {moment.author}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{formatDate(moment.timestamp)}</span>
                    <button 
                      onClick={() => handleDeleteMoment(moment.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      aria-label="Delete insight"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Lightbulb className="h-12 w-12 text-amber-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No insights found</h3>
          <p className="mt-2 text-sm text-gray-500">
            {moments.length === 0 ? 
              "Start capturing your team's lightbulb moments to build collective knowledge." :
              "Try adjusting your filters to see insights."}
          </p>
        </div>
      )}
    </div>
  );
}