import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import React from "react";

const World = React.lazy(() => import('./World'));

export function LazyWorld() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100);  
    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return <div className="w-300 h-300 items-center justify-center">
    </div>;
  }

  return (
    <Suspense fallback={
      <div className="w-300 h-300  items-center justify-center">
      </div>
    }>
      <World />
    </Suspense>
  );
}