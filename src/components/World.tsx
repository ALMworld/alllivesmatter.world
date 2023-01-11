import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { MeshBasicMaterial } from "three";
import Globe from "react-globe.gl";
// import countries from "../assets/simplifiedCountries.json";
import countries from "../../ptools/countries.json";
import { Loader } from "lucide-react";


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


export default function World() {
  const globeRef = useRef(null);

  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);

  // data
  const countriesData = countries.features;
  // const labelsData = countriesData.filter((d) => d.properties.POP_RANK >= 0);
  const labelsData = countriesData
  // print out the labelsData length
  // console.log(labelsData.length)


  // config
  const showLabelText = false;
  const labelSize = showLabelText ? 1.5 : 0;
  const labelResolution = showLabelText ? 3 : 1;
  const maxNumArcs = 12;
  const arcRelativeLength = 0.6; // relative to whole arc
  const arcFlightTime = 3000; // ms
  const arcSpawnInterval = arcFlightTime / maxNumArcs;
  const numRings = 3;
  const ringMaxRadius = 5; // deg
  const ringPropagationSpeed = 2; // deg/sec
  const ringRepeatPeriod = (arcFlightTime * arcRelativeLength) / numRings;
  const hexStartPolygonColor = "#6C946F"
  // const hexPolygonColor = "#102542";  // Define a default color

  const globeMaterialColor = "#101143"
  // const globeMaterialColor = "#1c3144"
  // const polygonSideColor =  '#eed31f'
  // const polygonSideColor = '#f4f1de'
  // const atmosphereColor = 'red'
  // const pointColor = '#e07a5f'
  // // '#49ac8f'
  // const polygonCapMaterialColor = "#e07a5f"  // color of land
  // const customLayerDataColor = '#faadfd'
  // const hexEndPolygonColor = "#ffd166"

  const globeMaterial = new MeshBasicMaterial({
    color: globeMaterialColor,
    opacity: 0.95,
    transparent: true
  });

  const rendererConfig = {
    antialias: false,
    alpha: false,
    precision: "lowp",
    powerPreference: "low-power"
  };

  const globeReady = () => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().enableZoom = false;
      globeRef.current.controls().autoRotateSpeed = 0.5;

      globeRef.current.pointOfView({
        lat: 19.054339351561637,
        lng: -50.421161072148465,
        altitude: 1.8,
      });
      setTimeout(() => {
        setIsGlobeLoaded(true);
      }, 100);

    }
  };

  const [hexPolygonColor, setHexPolygonColor] = useState(hexStartPolygonColor);

  // logic
  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);

  const spawnArc = useCallback(() => {
    // random source and destination
    const srcIdx = Math.floor(Math.random() * labelsData.length);
    let destIdx;
    do {
      destIdx = Math.floor(Math.random() * labelsData.length);
    } while (destIdx === srcIdx);

    const { LABEL_Y: srcLat, LABEL_X: srcLng } = labelsData[srcIdx].properties;
    const { LABEL_Y: destLat, LABEL_X: destLng } = labelsData[
      destIdx
    ].properties;


    // add and remove source rings
    const srcRing = { lat: srcLat, lng: srcLng };
    setRingsData((curRingsData) => [...curRingsData, srcRing]);
    setTimeout(() => {
      setRingsData((curRingsData) => curRingsData.filter((r) => r !== srcRing));
    }, arcFlightTime * arcRelativeLength);

    // add and remove arc after 1 cycle
    const arc = {
      startLat: srcLat,
      startLng: srcLng,
      endLat: destLat,
      endLng: destLng
    };
    setArcsData((curArcsData) => [...curArcsData, arc]);
    setTimeout(() => {
      setArcsData((curArcsData) => curArcsData.filter((d) => d !== arc));
    }, arcFlightTime * 2);

    // add and remove destination rings
    setTimeout(() => {
      const destRing = { lat: destLat, lng: destLng };
      setRingsData((curRingsData) => [...curRingsData, destRing]);
      setTimeout(() => {
        setRingsData((curRingsData) =>
          curRingsData.filter((r) => r !== destRing)
        );
      }, arcFlightTime * arcRelativeLength);
    }, arcFlightTime);
  }, [labelsData]);

  // spawn arcs regularly
  useEffect(() => {
    if (arcsData.length < maxNumArcs) {
      const id = setTimeout(() => {
        spawnArc();
      }, arcSpawnInterval);
      return () => {
        clearTimeout(id);
      };
    }
  }, [arcsData, arcSpawnInterval, spawnArc]);

  return (
    <div className="App" style={{ visibility: isGlobeLoaded ? 'visible' : 'hidden' }}>
      <Globe
        ref={globeRef}
        // globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        width={300}
        height={300}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={globeMaterial}
        atmosphereAltitude={0.1}
        hexPolygonsData={countriesData}
        hexPolygonAltitude={0.02}
        // hexPolygonResolution={2}
        // hexPolygonMargin={0.85}
        // hexPolygonColor={useCallback(() => "#000000", [])}
        hexPolygonCurvatureResolution={0}
        // globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        hexPolygonResolution={3}
        hexPolygonMargin={0.3}
        animateIn={true}

        hexPolygonUseDots={true}
        // hexPolygonColor={(d) =>
        //   //   d.properties.REGION_UN == "Americas" ? "#dbdbdb" : "#000"
        //   hexPolygonColor
        // }
        hexPolygonColor={useCallback((d) => {
          return hexPolygonColor;  // Return default color if data is incomplete
        }, [hexPolygonColor])}
        onGlobeReady={globeReady}

        labelsData={labelsData}
        labelLat={useCallback((d) => d.properties.LABEL_Y, [])}
        labelLng={useCallback((d) => d.properties.LABEL_X, [])}
        labelText={useCallback((d) => d.properties.NAME, [])}
        labelSize={labelSize}
        labelDotRadius={0.8}
        // labelColor={useCallback(() => "#ffba49", [])}
        labelColor={useCallback((labelData) => {
          // Get the UUID of the three.js object
          const uuid = labelData.__threeObj.uuid;
          // Create a deterministic "random" color based on the UUID
          const hash = uuid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
          // Use the hash to determine the color
          const color = hash % 3 >= 1 ? "#ffba49" : "#ffffff";

          return color;
        }, [])}


        labelAltitude={0.03}
        labelResolution={labelResolution}
        arcsData={arcsData}
        arcDashLength={arcRelativeLength}
        arcDashGap={2}
        arcDashInitialGap={1}
        arcDashAnimateTime={arcFlightTime}
        arcColor={useCallback(() => "#ffba49", [])}
        arcAltitudeAutoScale={0.3}
        arcsTransitionDuration={0}
        ringsData={ringsData}
        ringMaxRadius={ringMaxRadius}
        ringPropagationSpeed={ringPropagationSpeed}
        ringRepeatPeriod={ringRepeatPeriod}
        // ringColor={useCallback(() => (t) => `rgba(255,255,255,${1 - t})`, [])}
        ringColor={useCallback(() => (t) => `rgba(255, 186, 73, ${1 - t})`, [])}
        ringAltitude={0.03}
        waitForGlobeReady={true}
        rendererConfig={rendererConfig}
      />
    </div>
  );
}