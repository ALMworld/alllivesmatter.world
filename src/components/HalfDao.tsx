import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface LineData {
  id: string;
  t: number;
  yaoci: string;
  title: string;
  description: string;
}

interface HalfDaoProps {
  lang: string;
  lineTitles: string[];
  rawLines: string[];
  lineDescriptions: string[];
  yinFlags?: boolean[];
  hexagramName: string;
  outerTitle: string;
  outerDescription: string;

  hexgramGuaci: string;
  hexgramYongci: string;
  hexgramDescription: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  className?: string;
}

// Custom hook for mobile detection
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Custom hook to generate line data
const useLineData = (
  lang: string,
  lineTitles: string[],
  rawLines: string[],
  lineDescriptions: string[],
  binaryString: string,
): LineData[] => {
  return useMemo(() => {
    const tValues = [-5.2, -2.6, -1, 0.6, 3.8, 5.8];

    return lineTitles.map((title, index) => ({
      id: `node-${index + 1}`,
      t: tValues[index] || 0,
      yaoci: rawLines[index] || '',
      title,
      description: lineDescriptions[index] || '',
    }));
  }, [lineTitles, lineDescriptions, binaryString, lang]);
};

// Helper functions
const sigmoid = (t: number): number => {
  return 1 / (1 + Math.exp(-t));
};

const mapValue = (
  val: number,
  in1: number,
  in2: number,
  out1: number,
  out2: number,
): number => {
  return ((val - in1) * (out2 - out1)) / (in2 - in1) + out1;
};

const calculateNodePosition = (
  t: number,
  width: number,
  height: number,
  isMobile: boolean = false,
): { x: number; y: number } => {
  const margin = isMobile
    ? { top: 40, right: 15, bottom: 50, left: 30 }
    : { top: 40, right: 20, bottom: 50, left: 48 };

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const x = mapValue(t, -6, 6, margin.left, chartWidth + margin.left);
  const sigmoidValue = sigmoid(t);
  const y = mapValue(
    sigmoidValue,
    0,
    1,
    chartHeight + margin.top - 50,
    margin.top + 30,
  );
  return { x, y };
};

interface ChartNodeProps {
  stage: LineData;
  position: { x: number; y: number };
  isActive: boolean;
  onTap: () => void;
  isMobile: boolean;
}

const ChartNode: React.FC<ChartNodeProps> = ({
  stage,
  position,
  isActive,
  onTap,
  isMobile,
}) => {
  const radius = isActive ? 10 : 7;
  const titleColor = isActive ? '#f1c40f' : 'var(--rp-c-text-1, #ecf0f1)';
  const dotColor = isActive ? '#f1c40f' : 'var(--rp-c-text-1, #2c3e50)';

  const getTitleOffset = (stageId: string, isMobile: boolean = false) => {
    const mobileMultiplier = isMobile ? 0.7 : 1;
    const baseFontSize = isMobile ? 10 : 14;

    switch (stageId) {
      case 'node-1':
      case 'node-2':
      case 'node-6':
        return {
          x: -30 * mobileMultiplier,
          y: (radius + 5) * mobileMultiplier,
          fontSize: baseFontSize
        };
      case 'node-3':
      case 'node-4':
        return {
          x: (radius + 5) * mobileMultiplier,
          y: -8 * mobileMultiplier,
          fontSize: baseFontSize
        };
      case 'node-5':
      default:
        return {
          x: -30 * mobileMultiplier,
          y: -(radius + 25) * mobileMultiplier,
          fontSize: baseFontSize
        };
    }
  };

  const titleOffset = getTitleOffset(stage.id, isMobile);

  return (
    <>
      <circle
        cx={position.x}
        cy={position.y}
        r={radius}
        fill={dotColor}
        onClick={onTap}
        style={{ cursor: 'pointer' }}
      />
      <text
        x={position.x + titleOffset.x}
        y={position.y + titleOffset.y}
        fill={titleColor}
        fontSize={titleOffset.fontSize}
        fontWeight="bold"
        textAnchor="middle"
        onClick={onTap}
        style={{ cursor: 'pointer' }}
      >
        {stage.title}
      </text>
    </>
  );
};

interface HexagramProps {
  width: number;
  height: number;
  activeNodeId: string | null;
  showAll: boolean;
  onNodeTap: (nodeId: string) => void;
  onTitleTap: () => void;
  hexagramName: string;
  stages: LineData[];
  yinFlags?: boolean[];
  isMobile: boolean;
}

const Hexagram: React.FC<HexagramProps> = ({
  width,
  height,
  activeNodeId,
  showAll,
  onNodeTap,
  onTitleTap,
  hexagramName,
  stages,
  yinFlags = [],
  isMobile,
}) => {
  const hexagramX = isMobile ? 40 : 60;
  const yaoHeight = 8;
  const yaoWidth = isMobile ? 40 : 60;
  const yaoGap = isMobile ? 14 : 18;
  const titleY = 42;
  const reversedStages = [...stages].reverse();

  return (
    <g>
      <text
        x={hexagramX}
        y={titleY}
        fill={showAll ? '#f1c40f' : 'var(--rp-c-text-1, #ecf0f1)'}
        fontSize={isMobile ? "20" : "28"}
        fontWeight="bold"
        onClick={onTitleTap}
        style={{ cursor: 'pointer' }}
      >
        {hexagramName}
      </text>
      {reversedStages.map((stage, i) => {
        const yPos = titleY + 30 + i * yaoGap;
        const isActive = showAll || activeNodeId === stage.id;
        const lineColor = isActive ? '#e67e22' : 'var(--rp-c-text-1, #2c3e50)';
        const isYin = yinFlags[stages.length - 1 - i]; // Reverse index for yinFlags

        return (
          <g
            key={stage.id}
            onClick={() => onNodeTap(stage.id)}
            style={{ cursor: 'pointer' }}
          >
            {isYin ? (
              // Broken line (yin)
              <>
                <rect
                  x={hexagramX}
                  y={yPos}
                  width={yaoWidth * 0.4}
                  height={yaoHeight}
                  fill={lineColor}
                />
                <rect
                  x={hexagramX + yaoWidth * 0.6}
                  y={yPos}
                  width={yaoWidth * 0.4}
                  height={yaoHeight}
                  fill={lineColor}
                />
              </>
            ) : (
              // Solid line (yang)
              <rect
                x={hexagramX}
                y={yPos}
                width={yaoWidth}
                height={yaoHeight}
                fill={lineColor}
              />
            )}
            <text
              x={hexagramX + yaoWidth + 8}
              y={yPos + yaoHeight / 2 + 4}
              fill={isActive ? '#f1c40f' : 'var(--rp-c-text-3, #bdc3c7)'}
              fontSize={isMobile ? "9" : "11"}
              fontWeight={isActive ? 'bold' : 'normal'}
            >
              {stage.yaoci}
            </text>
          </g>
        );
      })}
    </g>
  );
};

interface InfoPanelProps {
  activeNodeId: string | null;
  showAll: boolean;
  stages: LineData[];
  hexgramGuaci: string;
  hexgramYongci: string;
  hexgramDescription: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  activeNodeId,
  showAll,
  stages,
  hexgramGuaci,
  hexgramYongci,
  hexgramDescription,
}) => {
  let data: { guaci: string; yongci: string; description: string } = {
    guaci: '',
    yongci: '',
    description: '',
  };

  if (showAll) {
    data = {
      guaci: hexgramGuaci,
      yongci: hexgramYongci,
      description: hexgramDescription,
    };
  } else if (activeNodeId) {
    const stageData = stages.find(s => s.id === activeNodeId)!;
    data = {
      guaci: stageData.title,
      yongci: stageData.yaoci,
      description: stageData.description,
    };
  }

  return (
    <div className="mt-5 p-3 sm:p-5 w-full bg-[var(--rp-home-feature-bg)] border border-transparent rounded-lg transition-all duration-300 ease-out hover:border-[var(--rp-c-brand)]">
      <h3 className="text-yellow-400 text-lg sm:text-xl font-bold mb-3 sm:mb-4">{data.guaci}</h3>
      <div className="pl-2 border-l-4 border-orange-600 mb-3 sm:mb-4">
        <div
          className="text-sm sm:text-base font-bold"
          style={{ color: 'var(--rp-c-text-1, #f1f1f1)' }}
        >
          {data.yongci}
        </div>
      </div>
      <p
        className="text-xs sm:text-sm leading-relaxed"
        style={{ color: 'var(--rp-c-text-2, #9ca3af)' }}
      >
        {data.description}
      </p>
    </div>
  );
};

interface PositiveSumCompetitionGraphProps {
  className?: string;
  stages: LineData[];
  outerTitle: string;
  outerDescription: string;
  hexagramName: string;
  yinFlags?: boolean[];
  hexgramGuaci: string;
  hexgramYongci: string;
  hexgramDescription: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export function PositiveSumCompetitionGraph({
  className,
  stages,
  outerTitle,
  outerDescription,
  hexagramName,
  hexgramGuaci,
  hexgramYongci,
  hexgramDescription,
  yAxisLabel = '竞争强度',
  xAxisLabel = '时间',
  yinFlags = [],
}: PositiveSumCompetitionGraphProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>('node-4');
  const [showAll, setShowAll] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 180, height: 280 });
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width || 320, height: rect.height || 280 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleNodeTap = (nodeId: string) => {
    if (activeNodeId === nodeId) {
      setActiveNodeId(null);
    } else {
      setActiveNodeId(nodeId);
      setShowAll(false);
    }
  };

  const handleTitleTap = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setActiveNodeId(null);
    }
  };

  const { width, height } = dimensions;
  const margin = isMobile
    ? { top: 40, right: 15, bottom: 50, left: 30 }
    : { top: 40, right: 20, bottom: 50, left: 40 };

  // Generate S-curve path
  const generateCurvePath = () => {
    const points: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = mapValue(i, 0, 100, -6, 6);
      const pos = calculateNodePosition(t, width, height, isMobile);
      points.push(`${i === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`);
    }
    return points.join(' ');
  };

  return (
    <div
      className={`w-full p-3 bg-[var(--rp-home-feature-bg)] border border-transparent rounded-lg transition-all duration-300 ${className || ''}`}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text text-transparent text-base sm:text-lg font-bold tracking-wide leading-relaxed mb-1.5">
          {/* All Attention is All you need to Make All Great Again */}
          {outerTitle}
        </h2>
        <p
          className="text-xs leading-relaxed tracking-wide px-3"
          style={{ color: 'var(--rp-c-text-2, #9ca3af)' }}
        >
          {/* New marketing strategy by giving 1% of profits to all humans, suitable for businesses in all stages. */}
          {outerDescription}
        </p>
      </div>

      {/* Chart */}
      <div className="aspect-[320/280] sm:aspect-[380/300]">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: 'visible' }}
        >
          {/* Axes */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="var(--rp-c-text-2, #7f8c8d)"
            strokeWidth="1.5"
          />
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="var(--rp-c-text-2, #7f8c8d)"
            strokeWidth="1.5"
          />

          {/* S-curve */}
          <path
            d={generateCurvePath()}
            fill="none"
            stroke="#3498db"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Hexagram */}
          <Hexagram
            width={width}
            height={height}
            activeNodeId={activeNodeId}
            showAll={showAll}
            onNodeTap={handleNodeTap}
            onTitleTap={handleTitleTap}
            hexagramName={hexagramName}
            stages={stages}
            yinFlags={yinFlags}
            isMobile={isMobile}
          />

          {/* Chart nodes */}
          {stages.map(stage => {
            const pos = calculateNodePosition(stage.t, width, height, isMobile);
            const isActive = showAll || stage.id === activeNodeId;
            return (
              <ChartNode
                key={stage.id}
                stage={stage}
                position={pos}
                isActive={isActive}
                onTap={() => handleNodeTap(stage.id)}
                isMobile={isMobile}
              />
            );
          })}

          {/* Axis labels */}
          <text
            x="15"
            y={margin.top + 60}
            fill="var(--rp-c-text-2, #7f8c8d)"
            fontSize={isMobile ? "10" : "12"}
            fontWeight="bold"
            textAnchor="middle"
            transform={`rotate(-90, 15, ${margin.top + 60})`}
          >
            {yAxisLabel}
          </text>
          <text
            x={width / 2}
            y={height - margin.bottom + 30}
            fill="var(--rp-c-text-2, #7f8c8d)"
            fontSize={isMobile ? "10" : "12"}
            fontWeight="bold"
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
        </svg>
      </div>

      {/* Info Panel */}
      <InfoPanel
        activeNodeId={activeNodeId}
        showAll={showAll}
        stages={stages}
        hexgramGuaci={hexgramGuaci}
        hexgramYongci={hexgramYongci}
        hexgramDescription={hexgramDescription}
      />
    </div>
  );
}

const HalfDao: React.FC<HalfDaoProps> = ({
  lang,
  lineTitles,
  rawLines,
  lineDescriptions,
  hexagramName,
  outerTitle,
  outerDescription,
  hexgramGuaci,
  hexgramYongci,
  hexgramDescription,
  yAxisLabel,
  xAxisLabel,
  yinFlags,
  className,
}) => {
  const binaryString = yinFlags?.map(yin => (yin ? '0' : '1')).join('') || '';
  const stages = useLineData(lang, lineTitles, rawLines, lineDescriptions, binaryString);

  return (
    <section className="relative flex flex-col justify-center  w-full">
      <div className="w-full max-w-full px-3">
        {/* <div className="flex items-center flex-col mb-8">
          <h1 className="text-[var(--rp-c-text-1)] font-bold text-3xl mt-16 sm:text-5xl sm:leading-none text-center">
            {t('yinyangTitle')}
          </h1>
          <p className="text-[var(--rp-c-text-2)] mt-8 mb-5 mx-6 text-center text-lg max-w-4xl">
            {t('yinyangDesc')}
          </p>
        </div> */}
        <PositiveSumCompetitionGraph
          className={className}
          stages={stages}
          outerTitle={outerTitle}
          outerDescription={outerDescription}
          hexgramGuaci={hexgramGuaci}
          hexgramYongci={hexgramYongci}
          hexgramDescription={hexgramDescription}
          hexagramName={hexagramName}
          yAxisLabel={yAxisLabel}
          xAxisLabel={xAxisLabel}
          yinFlags={yinFlags}
        />
      </div>
    </section>
  );
};

export default HalfDao;
