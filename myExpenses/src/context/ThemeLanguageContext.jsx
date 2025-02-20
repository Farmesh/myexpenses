import { createContext, useState, useContext, useEffect, useMemo } from 'react';

const ThemeLanguageContext = createContext();

const translations = {
  en: {
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    addExpense: 'Add Expense',
    profile: 'Profile',
    balance: 'Balance',
    monthlyBudget: 'Monthly Budget',
    description: 'Description',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    expenseTracker: 'Expense Tracker',
    home: 'Home',
    add: 'Add',
    logout: 'Logout',
    settings: 'Settings',
    welcome: 'Welcome',
    addNewExpense: 'Add New Expense',
    food: 'Food',
    transportation: 'Transportation',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    bills: 'Bills',
    other: 'Other',
    noExpenses: 'No expenses found',
    confirmDelete: 'Are you sure you want to delete this expense?',
    confirmLogout: 'Are you sure you want to logout?',
    successDelete: 'Expense deleted successfully',
    failedDelete: 'Failed to delete expense',
    successUpdate: 'Profile updated successfully',
    failedUpdate: 'Failed to update profile',
    insufficientBalance: 'Insufficient balance',
    invalidAmount: 'Please enter a valid amount',
    loading: 'Loading...',
    loginButton: 'Sign In',
    registerButton: 'Create Account',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    passwordMismatch: 'Passwords do not match',
    emailExists: 'Email already exists',
    loginFailed: 'Invalid email or password',
    networkError: 'Network error. Please try again.',
    // Add more translations
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    expenses: 'खर्च',
    addExpense: 'खर्च जोड़ें',
    profile: 'प्रोफ़ाइल',
    balance: 'बैलेंस',
    monthlyBudget: 'मासिक बजट',
    description: 'विवरण',
    amount: 'राशि',
    category: 'श्रेणी',
    date: 'तारीख',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    expenseTracker: 'खर्च ट्रैकर',
    home: 'होम',
    add: 'जोड़ें',
    logout: 'लॉग आउट',
    settings: 'सेटिंग्स',
    welcome: 'स्वागत है',
    addNewExpense: 'नया खर्च जोड़ें',
    food: 'भोजन',
    transportation: 'परिवहन',
    entertainment: 'मनोरंजन',
    shopping: 'खरीदारी',
    bills: 'बिल',
    other: 'अन्य',
    noExpenses: 'कोई खर्च नहीं मिला',
    confirmDelete: 'क्या आप इस खर्च को हटाना चाहते हैं?',
    confirmLogout: 'क्या आप लॉगआउट करना चाहते हैं?',
    successDelete: 'खर्च सफलतापूर्वक हटा दिया गया',
    failedDelete: 'खर्च हटाने में विफल',
    successUpdate: 'प्रोफ़ाइल अपडेट हो गया',
    failedUpdate: 'प्रोफ़ाइल अपडेट करने में विफल',
    insufficientBalance: 'अपर्याप्त बैलेंस',
    invalidAmount: 'कृपया वैध राशि दर्ज करें',
    loading: 'लोड हो रहा है...',
    loginButton: 'साइन इन करें',
    registerButton: 'खाता बनाएं',
    noAccount: "खाता नहीं है?",
    haveAccount: 'पहले से खाता है?',
    passwordMismatch: 'पासवर्ड मेल नहीं खाते',
    emailExists: 'ईमेल पहले से मौजूद है',
    loginFailed: 'अमान्य ईमेल या पासवर्ड',
    networkError: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
    // Add more translations
  }
};

export const ThemeLanguageProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('theme') || 'light'
  );
  const [language, setLanguage] = useState(() => 
    localStorage.getItem('language') || 'en'
  );

  // Memoize theme and language values
  const contextValue = useMemo(() => ({
    theme,
    toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
    language,
    changeLanguage: (lang) => setLanguage(lang),
    translate: (key) => translations[language][key] || key
  }), [theme, language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
  }, [theme, language]);

  return (
    <ThemeLanguageContext.Provider value={contextValue}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => useContext(ThemeLanguageContext); 