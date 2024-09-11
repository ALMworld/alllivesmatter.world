import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Globe from "globe.gl";
import countries from "../assets/countries.json";

const rendererConfig = {
  animateIn: true,
  // antialias: true,
  antialias: false,
  alpha: false,
  precision: "lowp",
  powerPreference: "low-power"
}

export default function World() {
  const globeContainerRef = useRef(null);
  const globeRef = useRef(null);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  // const [hexPolygonColor] = useState("#FF0000"); 
  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);

  const countriesData = useMemo(() => countries.features, []);
  const labelsData = useMemo(() => countries.features, []);

  // Config
  const maxNumArcs = 10;
  const arcFlightTime = 7000; // ms
  const arcSpawnInterval = arcFlightTime / maxNumArcs;
  const arcRelativeLength = 0.6; // relative to whole arc
  const numRings = 3;
  const ringMaxRadius = 2; // deg
  const ringPropagationSpeed = 1; // deg/sec
  const ringRepeatPeriod = (arcFlightTime * arcRelativeLength) / numRings;


  const spawnArc = useCallback(() => {
    if (labelsData.length === 0) return;

    const srcIdx = Math.floor(Math.random() * labelsData.length);
    let destIdx;
    do {
      destIdx = Math.floor(Math.random() * labelsData.length);
    } while (destIdx === srcIdx);

    const { LABEL_Y: srcLat, LABEL_X: srcLng } = labelsData[srcIdx].properties;
    const { LABEL_Y: destLat, LABEL_X: destLng } = labelsData[destIdx].properties;

    const arc = { startLat: srcLat, startLng: srcLng, endLat: destLat, endLng: destLng };

    const srcRing = { lat: srcLat, lng: srcLng };
    setRingsData(rings => [...rings, srcRing]);
    setTimeout(() => {
      setRingsData(rings => rings.filter(r => r !== srcRing));
    }, arcFlightTime * arcRelativeLength);

    setArcsData(arcs => [...arcs, arc]);
    setTimeout(() => {
      setArcsData(arcs => arcs.filter(d => d !== arc));
    }, arcFlightTime * 2);

    setTimeout(() => {
      const destRing = { lat: destLat, lng: destLng };
      setRingsData(rings => [...rings, destRing]);
      setTimeout(() => {
        setRingsData(rings => rings.filter(r => r !== destRing));
      }, arcFlightTime * arcRelativeLength);
    }, arcFlightTime);
  }, [labelsData, arcFlightTime, arcRelativeLength]);

  const initGlobe = useCallback(() => {
    if (!globeContainerRef.current || globeRef.current) return;

    const globe = Globe({ rendererConfig })(globeContainerRef.current);
    // const defaultGlobeMaterial = new MeshPhongMaterial({ color: 0x009000, });


    globe
      .width(300)
      .height(300)
      .backgroundColor("rgba(0,0,0,0)")
      // .globeImageUrl("/640px-land_ocean_ice_2048.jpg")
      // .globeImageUrl("/land_ocean_ice_2048.jpg")
      .atmosphereAltitude(0.1)
      .hexPolygonsData(countriesData)
      .hexPolygonAltitude(0.02)
      .hexPolygonCurvatureResolution(0)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.3)
      .hexPolygonUseDots(true)
      .hexPolygonColor(() => "#FF0000")
      .arcsData(arcsData)
      // .arcDashLength(arcRelativeLength)
      // .arcDashGap(2)
      .arcDashInitialGap(1)
      .arcDashAnimateTime(arcFlightTime)
      .arcDashLength(0.9)
      .arcDashGap(3)
      .arcDashInitialGap(1)
      .arcStroke(0.36) // Increased arc thickness
      .arcColor(() => "#ffba49")
      .arcAltitudeAutoScale(0.3)
      .arcsTransitionDuration(0.1)
      .ringsData(ringsData)
      .ringMaxRadius(ringMaxRadius)
      .ringPropagationSpeed(ringPropagationSpeed)
      .ringRepeatPeriod(ringRepeatPeriod)
      // .ringColor(() => t => `rgba(255, 186, 73, ${1 - t})`)
      .ringColor(() => (t: number) => `rgba(255, 186, 73, ${Math.sqrt(1 - t)})`)
      .ringAltitude(0.03)
      .ringResolution(248) // Increased resolution for smoother rings
      .ringMaxRadius(30) // 
      .onGlobeReady(() => {
        globe.controls().autoRotate = true;
        globe.controls().enableZoom = false;
        globe.controls().autoRotateSpeed = 0.5;
        globe.pointOfView({
          lat: 19.054339351561637,
          lng: -50.421161072148465,
          altitude: 1.8,
        });
        setIsGlobeLoaded(true);
      });

    globeRef.current = globe;
  }, [countriesData, arcFlightTime, arcRelativeLength, rendererConfig, ringMaxRadius, ringPropagationSpeed, ringRepeatPeriod]);

  useEffect(() => {
    initGlobe();

    return () => {
      if (globeRef.current) {
        globeRef.current.pauseAnimation();
        if (globeContainerRef.current) {
          while (globeContainerRef.current.firstChild) {
            globeContainerRef.current.removeChild(globeContainerRef.current.firstChild);
          }
        }
        globeRef.current = null;
      }
      setIsGlobeLoaded(false);
    };
  }, [initGlobe]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current
        .arcsData(arcsData)
        .ringsData(ringsData);
    }
  }, [arcsData, ringsData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (arcsData.length < maxNumArcs) {
        spawnArc();
      }
    }, arcSpawnInterval);

    return () => clearInterval(intervalId);
  }, [arcsData, maxNumArcs, arcSpawnInterval, spawnArc]);

  return (
    <div className="App" style={{
      opacity: isGlobeLoaded ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out'
    }}>
      <div ref={globeContainerRef} style={{ width: '300px', height: '300px' }} />
    </div>
  );
}