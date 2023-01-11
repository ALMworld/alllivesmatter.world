function generateCircles(bigRadius, smallRadius, arcShift, center) {
    const angles = [0, 72, 144, 216, 288]; // 5 evenly spaced angles
    const colors = ['#000000', '#00A651', '#EE334E', '#00A651', '#EE334E'];
  
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${center * 2} ${center * 2}">
    <!-- Large circle -->
    <circle cx="${center}" cy="${center}" r="${bigRadius}" fill="none" stroke="black" stroke-width="2" />
    
    <!-- Small circles and arcs -->\n`;

    let circlePositions = [];
    let arcCirclePositions = [];
    angles.forEach((angle, index) => {
      const radian = angle * Math.PI / 180;
      const x = center + bigRadius * Math.sin(radian);
      const y = center - bigRadius * Math.cos(radian);
      const arcX = center + (bigRadius - arcShift) * Math.sin(radian);
      const arcY = center - (bigRadius - arcShift) * Math.cos(radian);
      circlePositions.push({x, y});
      arcCirclePositions.push({arcX, arcY});

      // Half-circle with color of the previous arc (wrapping around for the first one)
      const otherColor = colors[(index - 1 + colors.length) % colors.length];
      
      // Full colored circle
      svgContent += `  <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${smallRadius}" fill="white" stroke="${otherColor}" stroke-width="2"  />\n`;

      // svgContent += `  <path d="M${x.toFixed(1)} ${(y - smallRadius).toFixed(1)} A${smallRadius},${smallRadius} 0 0,1 ${x.toFixed(1)},${(y + smallRadius).toFixed(1)} L${x.toFixed(1)},${y.toFixed(1)} Z" fill="${colors[index]}" transform="rotate(${angle}, ${x.toFixed(1)}, ${y.toFixed(1)})" />\n`;
    });

    // Generate arcs between circles
    for (let i = 0; i < arcCirclePositions.length; i++) {
      const start = arcCirclePositions[i];
      const end = arcCirclePositions[(i + 1) % arcCirclePositions.length];
      
      // Calculate the arc
      const largeArcFlag = 0; // 0 for minor arc, 1 for major arc
      const sweepFlag = 1; // 1 for clockwise, 0 for counterclockwise
      svgContent += `  <path id="arc${i+1}" d="M ${start.arcX.toFixed(1)},${start.arcY.toFixed(1)} A ${bigRadius},${bigRadius} 0 ${largeArcFlag},${sweepFlag} ${end.arcX.toFixed(1)},${end.arcY.toFixed(1)}" fill="none" stroke="white"  stroke-width="2" />\n`;
    }
  
    svgContent += '</svg>';
    return svgContent;
}

const bigRadius = 140;
const smallRadius = 3;
const arcShift = 0;
const center = 150;
const arcsSVG = generateCircles(bigRadius, smallRadius, arcShift, center);
console.log(arcsSVG);