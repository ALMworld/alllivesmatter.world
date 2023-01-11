import React, { useState, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AboutData, AdvocacyData, CommonData, DataTypes, HomeData, HowData, MenuData, TheoryData, WhyData } from './data_types';
import i18next from 'i18next';

// Create the context
// const DataContext = createContext({} as DataTypes);
const DataContext = createContext<DataTypes | undefined>(undefined);


// Create the provider component
export const DataProvider = ({ children }) => {
  const { ready } = useTranslation();

  if (!ready) {
    throw new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }

  const language = i18next.language;
  const value = i18next.store.data[language].translation as DataTypes;

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useCommonData = (): CommonData => {
  const context = useContext(DataContext);
  // Change the check to see if context is undefined, which is more accurate
  if (context === undefined) {
    throw new Error('useLocaleData must be used within a DataProvider');
  }

  return context.common_data;
};

export const useAdvocacyData = (): AdvocacyData => {
  const context = useContext(DataContext);
  // Change the check to see if context is undefined, which is more accurate
  if (context === undefined) {
    throw new Error('useLocaleData must be used within a DataProvider');
  }

  return context.advocacy_data;
};


export const useWhyData = (): WhyData => {
  const context = useContext(DataContext);
  // Change the check to see if context is undefined, which is more accurate
  if (context === undefined) {
    throw new Error('useLocaleData must be used within a DataProvider');
  }

  return context.why_data;
};

export const useHowData = (): HowData => {
  const context = useContext(DataContext);
  // Change the check to see if context is undefined, which is more accurate
  if (context === undefined) {
    throw new Error('useLocaleData must be used within a DataProvider');
  }

  return context.how_data;
};



export const useMenuData = (): MenuData => {
  const context = useContext(DataContext);
  // Change the check to see if context is undefined, which is more accurate
  if (context === undefined) {
    throw new Error('useLocaleData must be used within a DataProvider');
  }

  return context.menu_data;
};

export const useAboutData = (): AboutData => {
  const context = useContext(DataContext);
  // Change the check to see if context is undefined, which is more accurate
  if (context === undefined) {
    throw new Error('useLocaleData must be used within a DataProvider');
  }

  return context.about_data;
};

export const useData = (): DataTypes => {
  const context = useContext(DataContext);
  // Change the check to see if context is undefined, which is more accurate
  if (context === undefined) {
    throw new Error('useLocaleData must be used within a DataProvider');
  }

  return context;
};


export default DataProvider;