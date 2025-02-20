import { memo } from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const withTranslation = (WrappedComponent) => {
  return memo(function TranslatedComponent(props) {
    const { translate, language } = useThemeLanguage();
    return <WrappedComponent {...props} t={translate} currentLanguage={language} />;
  });
}; 