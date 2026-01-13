"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Clock, 
  User, 
  Share2, 
  Bookmark,
  Menu,
  ChevronDown,
  TrendingUp,
  ExternalLink
} from "lucide-react";

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [currentTime, setCurrentTime] = useState("--:--");
  const [isClient, setIsClient] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/news?country=us&category=${category}`
      );
      const data = await res.json();
      const articles = data.articles || [];
      setNews(articles);
      setFilteredNews(articles);
      
      // Set breaking news from actual data (first 2 articles)
      if (articles.length > 0) {
        setBreakingNews(articles.slice(0, Math.min(2, articles.length)));
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [category]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNews(news);
    } else {
      const filtered = news.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.source?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchQuery, news]);

  const newsSections = [
    { id: "", name: "Headlines" },
    { id: "business", name: "Business" },
    { id: "technology", name: "Technology" },
    { id: "sports", name: "Sports" },
    { id: "entertainment", name: "Entertainment" },
    { id: "health", name: "Health" },
  ];

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  // Click handler for news articles
  const handleNewsClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate reading time (approximate)
  const getReadingTime = (text) => {
    if (!text) return "1 min read";
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3" />
                <span>{currentTime}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:text-gray-300 transition">Subscribe</button>
              <button className="hover:text-gray-300 transition">Sign In</button>
              <Menu className="h-5 w-5 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-black flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NEWSWIRE</h1>
                <p className="text-xs text-gray-500">Global News Network</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for news, topics, or sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                <User className="h-4 w-4" />
                <span>My Feed</span>
              </button>
              <button 
                onClick={fetchNews}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Refresh news"
              >
                <TrendingUp className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-gray-100">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-1 overflow-x-auto">
                {newsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCategory(section.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                      category === section.id
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{section.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Breaking News Ticker - Now using real data */}
      {breakingNews.length > 0 && isClient && (
        <div className="bg-red-600 text-white py-2 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white text-red-600 px-3 py-1 font-bold text-sm mr-4">
                BREAKING
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  {breakingNews.map((item, index) => (
                    <span 
                      key={index} 
                      className="mx-8 cursor-pointer hover:underline"
                      onClick={() => handleNewsClick(item.url)}
                    >
                      {item.title} • 
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main News */}
          <div className="lg:col-span-2">
            {/* Featured Story */}
            {filteredNews.length > 0 && (
              <div className="mb-8">
                <div 
                  className="relative h-96 rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => handleNewsClick(filteredNews[0]?.url)}
                >
                  <img
                    src={filteredNews[0]?.urlToImage}
                    alt={filteredNews[0]?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-white text-black px-3 py-1 text-sm font-bold rounded">
                        FEATURED
                      </span>
                      <span className="text-white/90 text-sm">
                        {isClient ? getTimeAgo(filteredNews[0]?.publishedAt) : "Recently"}
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                      {filteredNews[0]?.title}
                    </h2>
                    <p className="text-white/80 text-lg mb-6 max-w-3xl">
                      {filteredNews[0]?.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-white/70" />
                          <span className="text-white/90 text-sm">
                            By {filteredNews[0]?.author || filteredNews[0]?.source?.name || "Staff Reporter"}
                          </span>
                        </div>
                        <span className="text-white/70">•</span>
                        <span className="text-white/90 text-sm">
                          {filteredNews[0]?.source?.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button 
                          className="text-white hover:text-gray-200 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Share functionality here
                          }}
                        >
                          <Share2 className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-white hover:text-gray-200 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Bookmark functionality here
                          }}
                        >
                          <Bookmark className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredNews.slice(1, 5).map((item, index) => (
                <article 
                  key={index}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  onClick={() => handleNewsClick(item.url)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.urlToImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/80 text-white px-3 py-1 text-xs font-bold rounded">
                        {item.source?.name || "News"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{isClient ? getTimeAgo(item.publishedAt) : "Recently"}</span>
                      <span className="mx-2">•</span>
                      <span>{getReadingTime(item.description)}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {item.source?.name?.charAt(0) || "N"}
                        </div>
                        <span className="text-sm text-gray-700">{item.author || item.source?.name || "Staff Reporter"}</span>
                      </div>
                      <button 
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Bookmark functionality here
                        }}
                      >
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* More Stories */}
            {filteredNews.length > 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">More Stories</h2>
                <div className="space-y-6">
                  {filteredNews.slice(5, 10).map((item, index) => (
                    <article 
                      key={index} 
                      className="flex items-start space-x-4 group cursor-pointer pb-6 border-b border-gray-100 last:border-0"
                      onClick={() => handleNewsClick(item.url)}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-24 w-24 rounded-lg overflow-hidden">
                          <img
                            src={item.urlToImage}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <span className="font-medium text-gray-700">{item.source?.name}</span>
                          <span className="mx-2">•</span>
                          <span>{isClient ? getTimeAgo(item.publishedAt) : "Recently"}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">{getReadingTime(item.description)}</span>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar with only real data */}
          <div className="lg:col-span-1">
            {/* Trending from actual news */}
            {filteredNews.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Trending Now</h3>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {filteredNews.slice(0, 5).map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between group cursor-pointer"
                      onClick={() => handleNewsClick(item.url)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                        <span className={`font-medium group-hover:text-blue-600 transition ${
                          index === 0 ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {item.title.length > 50 ? item.title.substring(0, 50) + "..." : item.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {isClient ? getTimeAgo(item.publishedAt) : "--"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Sources from actual data */}
            {news.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Top Sources</h3>
                <div className="space-y-3">
                  {Array.from(new Set(news.map(item => item.source?.name).filter(Boolean)))
                    .slice(0, 5)
                    .map((sourceName, index) => {
                      const sourceNews = news.filter(item => item.source?.name === sourceName);
                      return (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                          onClick={() => {
                            // Filter by this source
                            setFilteredNews(sourceNews);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`h-8 w-8 rounded flex items-center justify-center ${
                              index === 0 ? 'bg-red-600' :
                              index === 1 ? 'bg-blue-600' :
                              index === 2 ? 'bg-green-600' :
                              index === 3 ? 'bg-purple-600' : 'bg-gray-600'
                            }`}>
                              <span className="text-white font-bold text-sm">
                                {sourceName?.charAt(0) || "N"}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition">
                              {sourceName}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {sourceNews.length}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white mb-6">
              <h3 className="font-bold text-xl mb-3">Stay Informed</h3>
              <p className="text-blue-100 mb-6">
                Get daily news updates directly in your inbox. No spam, just the news that matters.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-blue-200 text-white focus:outline-none focus:border-white"
                />
                <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition">
                  Subscribe Now
                </button>
              </div>
              <p className="text-sm text-blue-200 mt-4">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading latest news...</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-white flex items-center justify-center">
                  <span className="text-black font-bold">N</span>
                </div>
                <span className="text-xl font-bold">NEWSWIRE</span>
              </div>
              <p className="text-gray-400 text-sm">
                Delivering trusted news from around the globe since 2024.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Sections</h4>
              <ul className="space-y-2 text-gray-400">
                {newsSections.map((section) => (
                  <li 
                    key={section.id}
                    className="hover:text-white cursor-pointer"
                    onClick={() => setCategory(section.id)}
                  >
                    {section.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">About Us</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
                <li className="hover:text-white cursor-pointer">Contact</li>
                <li className="hover:text-white cursor-pointer">Advertise</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4 mb-6">
                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((platform) => (
                  <div key={platform} className="h-10 w-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                    {platform.charAt(0)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Newswire Media. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Search Bar */}
      <div className="lg:hidden fixed bottom-6 right-6">
        <button className="h-14 w-14 bg-black rounded-full shadow-lg flex items-center justify-center">
          <Search className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Add marquee animation CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}