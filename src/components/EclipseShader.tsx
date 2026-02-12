import React, { useEffect, useRef } from 'react';

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Use u_time as the shader time source
  #define time u_time

  // Raymarching parameters
  #define MAX_STEPS 200
  #define NEAR_ENOUGH 0.001
  #define TOO_FAR 15.0

  #define BACKGROUND_COLOR 0.2*vec3(0.35686,0.14902,0.20392)
  #define SUN_COLOR vec3(0.96863,0.86275,0.50196)

  // Random function for dithering
  float rand(vec2 co) { return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453); }
  float dither(vec2 uv) { return (rand(uv)*2. - 1.) / 512.; }

  float sphere(vec3 point, vec3 center, float radius) {
      return length(point - center) - radius;
  }

  float distance_from_everything(vec3 point) {
      // Main blocking sphere (The Moon/Planet)
      float d = sphere(point, vec3(0, 0, 2), 1.);
      return d;
  }

  vec3 sun_position() {
      // Sun moves up and down based on time
      // Increased multiplier from 0.6 to 1.2 to make it raise higher
      // Adjusted offset to keep it starting low
      return vec3(0, 1.2*(1.+sin(.3*time)) - 0.5, 4.); 
  }

  float ray_march(vec3 ray_origin, vec3 ray_direction) {
      float d = 0.0;
      for (int i = 0; i < MAX_STEPS; i++) {
          vec3 point = ray_origin + ray_direction*d;
          float current_distance = distance_from_everything(point);
          d += current_distance;
          if (current_distance < NEAR_ENOUGH || d > TOO_FAR)
              break;
      }
      return d;
  }

  vec3 sample_sun(vec3 ray_origin, vec3 ray_direction) {
      float d = 0.0;
      float intensity = 0.;
      float inside = 0.;
      vec3 light = sun_position();
      for (int i = 0; i < MAX_STEPS; i++) {
          vec3 point = ray_origin + ray_direction*d;
          float current_distance = distance_from_everything(point);
          // March on in fixed steps for volumetric feel
          d += 0.05; // Reduced step size slightly for better resolution in WebGL
          if (d > TOO_FAR) break;
          
          intensity += pow(smoothstep(2., 0., length(point - light)), 2.);
          
          if (current_distance < NEAR_ENOUGH)
              inside += abs(current_distance);
      }
      // Revert to original loop structure for exact fidelity loop just in case
      // Note: In a real optimize we would merge these, but keeping structure close to reference
      
      d = 0.0;
      intensity = 0.;
      inside = 0.;
      for (int i = 0; i < 60; i++) { // Capped at 60 fixed steps for performance
        vec3 point = ray_origin + ray_direction * d;
        float current_distance = distance_from_everything(point);
        d += 1.0;
        intensity += pow(smoothstep(2., 0., length(point - light)), 2.);
        if (current_distance < NEAR_ENOUGH) inside += abs(current_distance);
        if (d > TOO_FAR) break;
      }

      return SUN_COLOR * intensity * exp(-10.*inside);
  }

  // Soft shadows
  float ray_shadow(vec3 ray_origin, vec3 ray_direction, vec3 light_position) {
      float d = NEAR_ENOUGH;
      float shade = 1.0;
      float shadow_factor = 32.;
      vec3 side = sign(light_position - ray_origin);
      
      for (int i = 0; i < MAX_STEPS; i++) {
          vec3 point = ray_origin + ray_direction*d;
          float current_distance = distance_from_everything(point);
          d += current_distance;
          shade = min(shade, shadow_factor * current_distance / d);
          if (d > TOO_FAR || sign(light_position - point) != side)
              break;
      }
      return max(shade, 0.);
  }

  vec3 estimate_normal(vec3 point) {
      vec2 e = vec2(NEAR_ENOUGH, 0);
      return normalize(vec3(
          distance_from_everything(point + e.xyy) - distance_from_everything(point - e.xyy),
          distance_from_everything(point + e.yxy) - distance_from_everything(point - e.yxy),
          distance_from_everything(point + e.yyx) - distance_from_everything(point - e.yyx)
      ));
  }

  vec3 lighting(vec3 point, vec3 camera, vec3 ray_direction, float dist) {
      if (length(point - camera) > TOO_FAR*0.99)
          return BACKGROUND_COLOR;

      vec3 light_position = sun_position();
      vec3 n = estimate_normal(point);
      vec3 l = normalize(light_position-point);

      float diffuse = max(dot(n, l), 0.);
      vec3 phong = diffuse * vec3(1);
      float shade = ray_shadow(point, l, light_position);

      return mix(BACKGROUND_COLOR, phong, shade);
  }

  void main() {
      // gl_FragCoord is in pixels, we need to normalize it
      vec2 xy = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

      vec3 camera = vec3(0, 1, 0); // Ray origin
      vec3 ray_direction = vec3(xy, 1.); // Ray direction

      float d = ray_march(camera, ray_direction);
      vec3 point = camera + ray_direction * d;
      
      vec3 base_color = lighting(point, camera, ray_direction, d);
      base_color += sample_sun(camera, ray_direction);

      gl_FragColor = vec4(base_color + dither(gl_FragCoord.xy), 1.);
  }
`;

interface EclipseShaderProps {
  step: number; // 0 to 10
}

export const EclipseShader: React.FC<EclipseShaderProps> = ({ step }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation State
  const animationState = useRef({
    currentTime: -5.2,
    targetTime: -5.2,
    lastFrameTime: 0,
  });

  // Map 'step' (0-10) to the rising phase of the sine wave
  // Period of sin(0.3x) is ~20.9.
  // Peak at PI/2 / 0.3 approx 5.23
  // Trough at -PI/2 / 0.3 approx -5.23
  // Using -5.2 to 5.2 to cover full rise from bottom to top
  useEffect(() => {
    const MIN_TIME = -5.2; // Start at bottom
    const MAX_TIME = 5.2;  // End at top
    const progress = Math.min(Math.max(step / 10, 0), 1);
    
    animationState.current.targetTime = MIN_TIME + progress * (MAX_TIME - MIN_TIME);
  }, [step]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, vertexShaderSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, fragmentShaderSource);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('Shader Compile Error:', gl.getShaderInfoLog(fs));
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
         canvas.width = canvas.clientWidth;
         canvas.height = canvas.clientHeight;
         gl.viewport(0, 0, canvas.width, canvas.height);
      }

      const now = performance.now();
      const deltaTime = (now - animationState.current.lastFrameTime) / 1000;
      animationState.current.lastFrameTime = now;

      // Smooth interpolation for the time variable
      const speed = 2.0;
      const alpha = 1.0 - Math.exp(-speed * deltaTime);
      const diff = animationState.current.targetTime - animationState.current.currentTime;
      animationState.current.currentTime += diff * alpha;

      // Send Uniforms
      gl.uniform1f(timeLocation, animationState.current.currentTime);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationState.current.lastFrameTime = performance.now();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};