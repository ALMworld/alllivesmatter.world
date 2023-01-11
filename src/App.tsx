import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Suspense } from 'react';
import Advocacy from './pages/Advocacy';
import Theory from './pages/Why';
import { DataProvider } from './data/data_provider';
import About from './pages/About';
import AnimatedLoading from './components/AnimatedLoading';
import { Loader2 } from 'lucide-react';
import How from './pages/How';
import Why from './pages/Why';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import Footer from './components/Footer';

import ReactGA from "react-ga4";
import React from 'react';
import PeaceMusicPlayer from './components/PeaceMusicPlayer';

ReactGA.initialize("G-XQE11X3WB2");
// Send pageview with a custom path
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname,
  title: "home"
});



function PageViewTracker() {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}


const App = () => {

  return (
    <Suspense fallback={<AnimatedLoading />}>
      <BrowserRouter>
        <PageViewTracker />
        <DataProvider>
          <Header />
          <Routes>
            <Route path='/' element={<Advocacy />} />
            <Route path='/why' element={<Why />} />
            <Route path='/about' element={<About />} />
            <Route path='/how' element={<How />} />
          </Routes>
          <Footer />
          <PeaceMusicPlayer />
        </DataProvider>
      </BrowserRouter>
    </Suspense>
  )
}
export default App

