import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Bell,
  User,
  Server,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Database,
  Info,
  Save,
  RefreshCcw,
  Download
} from 'lucide-react';

// --- [Shadcn-style Components (Self-Contained)] ---
// We re-create the components here for a single-file setup,
// styling them to match the dark theme.

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-lg backdrop-blur-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={`text-xl font-semibold leading-none tracking-tight text-white flex items-center gap-2 ${className}`} {...props}>
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={`text-sm text-slate-400 ${className}`} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex items-center p-6 pt-0 ${className}`} {...props} />
));
CardFooter.displayName = "CardFooter";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 file:border-0 file:bg-transparent 
              file:text-sm file:font-medium placeholder:text-slate-500 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 
              disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20",
    secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600",
    ghost: "bg-transparent hover:bg-slate-700 text-slate-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <button
      ref={ref}
      className={`${baseStyle} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <button
    type="button"
    role="switch"
    aria-checked={props.checked}
    data-state={props.checked ? 'checked' : 'unchecked'}
    onClick={props.onCheckedChange ? () => props.onCheckedChange(!props.checked) : undefined}
    className={`peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 
              data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-700 ${className}`}
    {...props}
  >
    <span
      data-state={props.checked ? 'checked' : 'unchecked'}
      className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 
                transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
    />
  </button>
));
Switch.displayName = "Switch";

const Select = ({ children, className, ...props }) => (
  <div className="relative">
    <select
      className={`appearance-none w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-md py-2 px-3 pl-4 pr-8 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
);

// --- [Main Settings Page Component] ---

export default function AdminSetting() {
  // State for form elements
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('blue');
  const [notifications, setNotifications] = useState({
    complaints: true,
    alerts: true,
    reports: false,
  });
  const [account, setAccount] = useState({
    name: 'Admin User',
    email: 'admin@municipal.gov',
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showNewPass, setShowNewPass] = useState(false);

  // Handle state changes
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAccountChange = (e) => {
    setAccount(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const accentColorMap = {
    blue: 'bg-blue-500',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* 1. Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Settings className="w-8 h-8 text-blue-400" />
            Settings
          </h1>
          <p className="text-base text-slate-400 mt-1">Manage your preferences and system configurations.</p>
        </div>
      </header>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- [Left Column: Main Forms] --- */}
        <div className="lg:col-span-2 space-y-6">

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle><User className="w-5 h-5 text-blue-400" /> Account Settings</CardTitle>
              <CardDescription>Update your profile and password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={account.name} onChange={handleAccountChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={account.email} readOnly disabled />
                  </div>
                </div>
                
                <hr className="border-slate-700" />
                
                <h4 className="text-lg font-medium text-slate-100">Change Password</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-pass">Current Password</Label>
                    <Input id="current-pass" name="current" type="password" value={passwords.current} onChange={handlePasswordChange} />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="new-pass">New Password</Label>
                    <Input 
                      id="new-pass" 
                      name="new" 
                      type={showNewPass ? "text" : "password"} 
                      value={passwords.new} 
                      onChange={handlePasswordChange} 
                    />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-[2.2rem] text-slate-400 hover:text-slate-200">
                      {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-pass">Confirm New Password</Label>
                    <Input id="confirm-pass" name="confirm" type="password" value={passwords.confirm} onChange={handlePasswordChange} />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle><Bell className="w-5 h-5 text-blue-400" /> Notification Settings</CardTitle>
              <CardDescription>Manage how you receive system notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <Label htmlFor="complaints" className="font-medium text-base text-slate-100">Complaint Updates</Label>
                  <p className="text-sm text-slate-400">Get notified about new or updated complaints.</p>
                </div>
                <Switch id="complaints" checked={notifications.complaints} onCheckedChange={() => handleNotificationChange('complaints')} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <Label htmlFor="alerts" className="font-medium text-base text-slate-100">System Alerts</Label>
                  <p className="text-sm text-slate-400">Receive critical system alerts and warnings.</p>
                </div>
                <Switch id="alerts" checked={notifications.alerts} onCheckedChange={() => handleNotificationChange('alerts')} />
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div>
                  <Label htmlFor="reports" className="font-medium text-base text-slate-100">Department Reports</Label>
                  <p className="text-sm text-slate-400">Receive weekly/monthly department reports.</p>
                </div>
                <Switch id="reports" checked={notifications.reports} onCheckedChange={() => handleNotificationChange('reports')} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- [Right Column: Side Panels] --- */}
        <div className="lg:col-span-1 space-y-6">

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle><Palette className="w-5 h-5 text-blue-400" /> Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="font-medium text-slate-100">Dark Mode</Label>
                <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <Select id="accent-color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}>
                  <option value="blue">Blue</option>
                  <option value="cyan">Cyan</option>
                  <option value="emerald">Emerald</option>
                  <option value="violet">Violet</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-6 rounded ${accentColorMap[accentColor]}`}></div>
                    <div className="flex-1 h-3 bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-3 bg-slate-700 rounded"></div>
                    <div className={`w-6 h-6 rounded-full ${accentColorMap[accentColor]}`}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Info Panel */}
          <Card>
            <CardHeader>
              <CardTitle><Info className="w-5 h-5 text-blue-400" /> System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-2"><Server className="w-4 h-4" /> Server Status</span>
                <span className="flex items-center gap-2 text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-2"><Database className="w-4 h-4" /> Last Backup</span>
                <span className="text-slate-100">2025-11-07 04:00 AM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 flex items-center gap-2"><Info className="w-4 h-4" /> App Version</span>
                <span className="text-slate-100">v2.1.3-beta</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Bottom Actions Section */}
      <footer className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-700/50">
        <Button variant="ghost" className="w-full sm:w-auto"><Download className="w-4 h-4 mr-2" /> Backup Now</Button>
        <Button variant="secondary" className="w-full sm:w-auto"><RefreshCcw className="w-4 h-4 mr-2" /> Reset to Default</Button>
        <Button variant="primary" className="w-full sm:w-auto"><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
      </footer>

    </div>
  );
}