import { useEffect, useRef, useState, useCallback } from "react";
import Globe from "globe.gl";
import countries from "../assets/countries.json";

export default function World() {
  const globeContainerRef = useRef(null);
  const globeRef = useRef(null);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const [hexPolygonColor, setHexPolygonColor] = useState("#FF0000");
  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);

  const countriesData = countries.features;
  const labelsData = countriesData;

  // Config
  const maxNumArcs = 12;
  const arcFlightTime = 3000; // ms
  const arcSpawnInterval = arcFlightTime / maxNumArcs;
  const arcRelativeLength = 0.6; // relative to whole arc
  const numRings = 3;
  const ringMaxRadius = 5; // deg
  const ringPropagationSpeed = 2; // deg/sec
  const ringRepeatPeriod = (arcFlightTime * arcRelativeLength) / numRings;

  const rendererConfig = {
    antialias: false,
    alpha: false,
    precision: "lowp",
    powerPreference: "low-power"
  };

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

  useEffect(() => {
    if (globeContainerRef.current && !globeRef.current) {
      const globe = Globe({ rendererConfig })(globeContainerRef.current);
      
      globe
        .width(300)
        .height(300)
        .backgroundColor("rgba(0,0,0,0)")
        .atmosphereAltitude(0.1)
        .hexPolygonsData(countriesData)
        .hexPolygonAltitude(0.02)
        .hexPolygonCurvatureResolution(0)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.3)
        .hexPolygonUseDots(true)
        .hexPolygonColor(() => hexPolygonColor)
        .arcsData(arcsData)
        .arcDashLength(arcRelativeLength)
        .arcDashGap(2)
        .arcDashInitialGap(1)
        .arcDashAnimateTime(arcFlightTime)
        .arcColor(() => "#ffba49")
        .arcAltitudeAutoScale(0.3)
        .arcsTransitionDuration(0)
        .ringsData(ringsData)
        .ringMaxRadius(ringMaxRadius)
        .ringPropagationSpeed(ringPropagationSpeed)
        .ringRepeatPeriod(ringRepeatPeriod)
        .ringColor(() => t => `rgba(255, 186, 73, ${1 - t})`)
        .ringAltitude(0.03)
        .onGlobeReady(() => {
          console.log("Globe is ready");
          globe.controls().autoRotate = true;
          globe.controls().enableZoom = false;
          globe.controls().autoRotateSpeed = 0.5;
          globe.pointOfView({
            lat: 19.054339351561637,
            lng: -50.421161072148465,
            altitude: 1.8,
          });
          setTimeout(() => setIsGlobeLoaded(true), 100);
        });
      globeRef.current = globe;
    }
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current
        .hexPolygonColor(() => hexPolygonColor)
        .arcsData(arcsData)
        .ringsData(ringsData);
    }
  }, [hexPolygonColor, arcsData, ringsData]);

  useEffect(() => {
    if (arcsData.length < maxNumArcs) {
      const timeoutId = setTimeout(spawnArc, arcSpawnInterval);
      return () => clearTimeout(timeoutId);
    }
  }, [arcsData, arcSpawnInterval, spawnArc, maxNumArcs]);

  // const changeHexagonColor = () => {
  //   const newColor = hexPolygonColor === "#6C946F" ? "#FF0000" : "#6C946F";
  //   console.log("Changing hexagon color to:", newColor);
  //   setHexPolygonColor(newColor);
  // };

  return (
    <div className="App" style={{ visibility: isGlobeLoaded ? 'visible' : 'hidden' }}>
      <div ref={globeContainerRef} />
      {/* <button onClick={changeHexagonColor}>Change Hexagon Color</button> */}
    </div>
  );
}