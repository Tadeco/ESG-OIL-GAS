import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  Settings,
  Users,
  Shield,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Upload,
  Building2,
  Leaf,
  Scale,
  UserCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
  notifications?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: NavItem[];
}

const Layout: React.FC<LayoutProps> = ({
  children,
  user = { name: 'John Doe', email: 'john.doe@shell.com', role: 'ESG Analyst' },
  theme = 'light',
  onThemeToggle = () => {},
  onLogout = () => {},
  onNavigate = () => {},
  currentPath = '/dashboard',
  notifications = 3
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>(['contracts']);

  // Navigation items
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      id: 'contracts',
      label: 'Contracts',
      icon: <FileText className="w-5 h-5" />,
      path: '/contracts',
      badge: 5,
      children: [
        { id: 'all-contracts', label: 'All Contracts', icon: <FileText className="w-4 h-4" />, path: '/contracts' },
        { id: 'upload', label: 'Upload New', icon: <Upload className="w-4 h-4" />, path: '/contracts/upload' },
        { id: 'templates', label: 'Templates', icon: <FileText className="w-4 h-4" />, path: '/contracts/templates' }
      ]
    },
    {
      id: 'analysis',
      label: 'ESG Analysis',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/analysis',
      children: [
        { id: 'environmental', label: 'Environmental', icon: <Leaf className="w-4 h-4" />, path: '/analysis/environmental' },
        { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" />, path: '/analysis/social' },
        { id: 'governance', label: 'Governance', icon: <Scale className="w-4 h-4" />, path: '/analysis/governance' }
      ]
    },
    {
      id: 'compliance',
      label: 'Compliance',
      icon: <Shield className="w-5 h-5" />,
      path: '/compliance'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <TrendingUp className="w-5 h-5" />,
      path: '/reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/settings'
    }
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'alert',
      title: 'High Risk Contract',
      message: 'Contract #2024-ESG-001 contains high-risk clauses',
      time: '5 minutes ago',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 2,
      type: 'success',
      title: 'Analysis Complete',
      message: 'ESG analysis for Q4 contracts completed',
      time: '1 hour ago',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: 3,
      type: 'info',
      title: 'New Compliance Update',
      message: 'EU Taxonomy regulations updated',
      time: '2 hours ago',
      icon: <Shield className="w-4 h-4" />
    }
  ];

  // Toggle expanded state for nav items
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen || notificationMenuOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu') && !target.closest('.notification-menu')) {
          setUserMenuOpen(false);
          setNotificationMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen, notificationMenuOpen]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onNavigate(item.path);
              if (window.innerWidth < 1024) {
                setMobileMenuOpen(false);
              }
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
            level > 0 ? 'ml-4' : ''
          } ${
            isActive
              ? theme === 'dark'
                ? 'bg-green-900/30 text-green-400 border-l-4 border-green-500'
                : 'bg-green-50 text-green-700 border-l-4 border-green-500'
              : theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span className={`font-medium ${!sidebarOpen && level === 0 ? 'hidden' : ''}`}>
              {item.label}
            </span>
            {item.badge && sidebarOpen && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && sidebarOpen && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          )}
        </button>
        {hasChildren && isExpanded && sidebarOpen && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-full transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${
        theme === 'dark' ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
      } ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className={`flex items-center justify-between p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  OIL & GAS ESG
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Contract Analyzer
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hidden lg:block p-1.5 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${
              sidebarOpen ? 'rotate-180' : ''
            }`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-5rem)]">
          {navItems.map(item => renderNavItem(item))}
        </nav>

        {/* User Info (Bottom) */}
        {sidebarOpen && (
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {user.name}
                </p>
                <p className={`text-xs truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      }`}>
        {/* Top Navigation */}
        <header className={`sticky top-0 z-30 ${
          theme === 'dark' ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'
        }`}>
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Menu Toggle & Search */}
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-xl">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contracts, reports, or analysis..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-green-500'
                  }`}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative notification-menu">
                <button
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  className={`relative p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b transition-colors cursor-pointer ${
                            theme === 'dark' 
                              ? 'border-gray-700 hover:bg-gray-700' 
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'alert' 
                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                : notification.type === 'success'
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mt-0.5 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-1 flex items-center gap-1 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={`px-4 py-3 ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                    }`}>
                      <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Help */}
              <button
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative user-menu">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <ChevronDown className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => onNavigate('/profile')}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => onNavigate('/settings')}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          theme === 'dark' 
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Settings
                      </button>
                    </div>
                    <div className={`px-4 py-3 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`p-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;