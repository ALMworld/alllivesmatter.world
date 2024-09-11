import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Globe from "globe.gl";
import countries from "../assets/countries.json";

const rendererConfig = {
  animateIn: true,
  antialias: false, 
  alpha: false,
  precision: "lowp",
  powerPreference: "low-power"
}

const countriesData = countries.features; // data may have errors,  do not brother about it,

// https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita //2024 estimiate IMF
const TOP_GPC_REGIONS = [
  { country: "Luxembourg", gdpPerCapita: 143743 },
  { country: "Ireland", gdpPerCapita: 133822 },
  { country: "Singapore", gdpPerCapita: 133737 },
  { country: "Macau", gdpPerCapita: 125510 },
  { country: "Qatar", gdpPerCapita: 112283 },
  { country: "United Arab Emirates", gdpPerCapita: 96846 },
  { country: "Switzerland", gdpPerCapita: 91932 },
  { country: "San Marino", gdpPerCapita: 86989 },
  { country: "United States of America", gdpPerCapita: 85373 }, // //Change from United States
  { country: "Norway", gdpPerCapita: 82832 },
  { country: "Guyana", gdpPerCapita: 80137 },
  { country: "Denmark", gdpPerCapita: 77641 },
  { country: "Brunei", gdpPerCapita: 77534 },
  { country: "Taiwan", gdpPerCapita: 76858 },
  { country: "Faroe Islands", gdpPerCapita: 76566 },
  { country: "Hong Kong", gdpPerCapita: 75128 },
  { country: "Netherlands", gdpPerCapita: 74158 },
  { country: "Iceland", gdpPerCapita: 73784 },
  { country: "Saudi Arabia", gdpPerCapita: 70333 },
  { country: "Austria", gdpPerCapita: 69460 },
  { country: "Sweden", gdpPerCapita: 69177 },
  { country: "Andorra", gdpPerCapita: 69146 },
  { country: "Belgium", gdpPerCapita: 68079 },
  { country: "Malta", gdpPerCapita: 67682 },
  { country: "Germany", gdpPerCapita: 67245 },
  { country: "Australia", gdpPerCapita: 66627 },
  { country: "Bahrain", gdpPerCapita: 62671 },
  { country: "Finland", gdpPerCapita: 60851 },
  { country: "Canada", gdpPerCapita: 60495 },
  { country: "France", gdpPerCapita: 60339 },
  { country: "South Korea", gdpPerCapita: 59330 },
  { country: "United Kingdom", gdpPerCapita: 58880 },
  { country: "European Union", gdpPerCapita: 58838 },
  { country: "Cyprus", gdpPerCapita: 58733 },
  { country: "Italy", gdpPerCapita: 56905 },
  { country: "Israel", gdpPerCapita: 55533 },
  { country: "Aruba", gdpPerCapita: 54716 },
  { country: "Japan", gdpPerCapita: 54184 },
  { country: "New Zealand", gdpPerCapita: 53797 },
  { country: "Slovenia", gdpPerCapita: 53287 },
  { country: "Kuwait", gdpPerCapita: 52274 },
  { country: "Spain", gdpPerCapita: 52012 },
  { country: "Lithuania", gdpPerCapita: 50600 },
  { country: "Czech Republic", gdpPerCapita: 50475 },
  { country: "Poland", gdpPerCapita: 49060 },
  { country: "Portugal", gdpPerCapita: 47070 },
  { country: "Bahamas", gdpPerCapita: 46524 },
  { country: "Croatia", gdpPerCapita: 45702 },
  { country: "Hungary", gdpPerCapita: 45692 },
  { country: "Estonia", gdpPerCapita: 45122 },
  { country: "Panama", gdpPerCapita: 44797 },
  { country: "Slovakia", gdpPerCapita: 44081 },
  { country: "Turkey", gdpPerCapita: 43921 },
];

const maxAdditionalWeight = 30; // Adjust this value to control the maximum weight
const maxGpc = Math.max(...TOP_GPC_REGIONS.map(c => c.gdpPerCapita));
const minGpc = Math.min(...TOP_GPC_REGIONS.map(c => c.gdpPerCapita));

const TopGpcRegionsWithLocId = TOP_GPC_REGIONS.map(country => {
  const ratioScore = (country.gdpPerCapita - minGpc) / (maxGpc - minGpc);
  const extraWeight = ratioScore * maxAdditionalWeight;
  return {
    ...country,
    extraWeight,
    loc_id: countriesData.findIndex(c => c.properties.NAME === country.country)
  };
}).filter(item => item.loc_id !== -1).slice(0, 36);

const totalExtraWeight = TopGpcRegionsWithLocId.reduce((sum, country) => sum + country.extraWeight, 0);

console.log("TopGpcRegionsWithLocId", TopGpcRegionsWithLocId);


function randomSelectSrcIdx() {
  const totalLength = countriesData.length + totalExtraWeight;
  const preSrcIdx = Math.random() * totalLength;

  if (preSrcIdx < countriesData.length) {
    return Math.floor(preSrcIdx); // Direct selection from original countries
  } else {
    let accumulatedWeight = countriesData.length;
    for (const country of TopGpcRegionsWithLocId) {
      accumulatedWeight += country.extraWeight;
      if (preSrcIdx < accumulatedWeight) {
        return country.loc_id;
      }
    }
  }

  // Fallback (should not reach here under normal circumstances)
  return Math.floor(Math.random() * countriesData.length);
}

// // Function to select srcIdx with extra weight for certain countries
// function randomSelectSrcIdx() {
//   const extraWeight4TopPppRegion = 12 
//   const srcRandomLength = countriesData.length + TopPppRegionsWithLocId.length * extraWeight4TopPppRegion

//   const preSrcIdx = Math.floor(Math.random() * srcRandomLength);

//   if (preSrcIdx < countriesData.length) {
//     return preSrcIdx; // Direct selection from original countries
//   } else {
//     // console.log("preSrcIdx", preSrcIdx)
//     // Selection from weighted countries
//     const idx = Math.floor((preSrcIdx - countriesData.length) / extraWeight4TopPppRegion);
//     return TopPppRegionsWithLocId[idx].loc_id;
//   }
// }

export default function World() {
  const globeContainerRef = useRef(null);
  const globeRef = useRef(null);
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  // const [hexPolygonColor] = useState("#FF0000"); 
  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);

  // Config
  const maxNumArcs = 10;
  const arcFlightTime = 12000; // ms
  const arcSpawnInterval = arcFlightTime / maxNumArcs;
  const arcRelativeLength = 0.6; // relative to whole arc
  const numRings = 3;
  const ringMaxRadius = 6; // deg
  const ringPropagationSpeed = 1; // deg/sec
  const ringRepeatPeriod = (arcFlightTime * arcRelativeLength) / numRings;


  const spawnArc = useCallback(() => {
    if (countriesData.length === 0) return;

    const srcIdx = randomSelectSrcIdx();
    let destIdx;
    do {
      destIdx = Math.floor(Math.random() * countriesData.length);
    } while (destIdx === srcIdx);

    const { LABEL_Y: srcLat, LABEL_X: srcLng } = countriesData[srcIdx].properties;
    const { LABEL_Y: destLat, LABEL_X: destLng } = countriesData[destIdx].properties;

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
  }, [arcFlightTime, arcRelativeLength]);

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