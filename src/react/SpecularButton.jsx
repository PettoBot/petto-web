import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import './SpecularButton.css';

const PAD = 20;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 light = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(normal, light)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float x = d / (uThickness + 1e-6);
  float line = exp(-mix(1.0, 1.6, smoothstep(0.0, 1.5, x)) * x * x);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float highlight = line * rim * edgeClamp * uIntensity;
  vec3 color = uBaseColor * base + uLineColor * highlight;
  fragColor = vec4(color, clamp(base + highlight, 0.0, 1.0));
}
`;

export default function SpecularButton({
  children = 'Get Started',
  href = undefined,
  target = undefined,
  rel = undefined,
  form = undefined,
  name = undefined,
  value = undefined,
  ariaLabel = undefined,
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = true,
  transparent = false,
  disabled = false,
  onClick = undefined,
  className = '',
  type = 'button',
}) {
  const buttonRef = useRef(null);
  const fxRef = useRef(null);
  const propsRef = useRef({});

  propsRef.current = { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  useEffect(() => {
    const button = buttonRef.current;
    const fx = fxRef.current;
    if (!button || !fx || typeof window === 'undefined') return undefined;

    let renderer;
    let raf = 0;
    let resizeObserver;

    try {
      const dpr = window.devicePixelRatio || 1;
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;
      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.32, 0.32, 0.32] },
          uIntensity: { value: 1 },
          uShineSize: { value: 0.17 },
          uShineFade: { value: 0.7 },
          uThickness: { value: 1 },
          uBaseWidth: { value: dpr },
        },
      });
      const mesh = new Mesh(gl, { geometry, program });
      fx.appendChild(gl.canvas);

      const size = { width: 1, height: 1 };
      const resize = () => {
        const rect = button.getBoundingClientRect();
        size.width = rect.width;
        size.height = rect.height;
        renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
        program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr];
        program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr];
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(button);
      resize();

      let pointerAngle = null;
      let proximityAmount = 0;
      const onPointerMove = (event) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
        const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
        const distance = Math.hypot(dx, dy);
        if (distance === 0) {
          const nx = (event.clientX - centerX) / (rect.width / 2);
          const ny = (centerY - event.clientY) / (rect.height / 2);
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
        } else {
          pointerAngle = Math.atan2(centerY - event.clientY, event.clientX - centerX);
        }
        const t = Math.max(0, 1 - distance / Math.max(propsRef.current.proximity, 1));
        proximityAmount = t * t * (3 - 2 * t);
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      let angle = 2.4;
      let idleAngle = 2.4;
      let brightness = 0;
      let last = performance.now();
      const line = new Color();
      const base = new Color();
      const update = (now) => {
        raf = requestAnimationFrame(update);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const props = propsRef.current;
        idleAngle += props.speed * dt;
        const steered = props.followMouse && pointerAngle !== null && (!props.autoAnimate || proximityAmount > 0);
        const targetAngle = steered ? pointerAngle : idleAngle;
        const diff = ((targetAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        angle += diff * (1 - Math.exp(-dt * 7));
        const targetBrightness = props.autoAnimate ? 1 : proximityAmount;
        brightness += (targetBrightness - brightness) * (1 - Math.exp(-dt * 8));
        line.set(props.lineColor);
        base.set(props.baseColor);
        program.uniforms.uAngle.value = angle;
        program.uniforms.uRadius.value = Math.min(props.radius, Math.min(size.width, size.height) / 2) * dpr;
        program.uniforms.uLineColor.value = [line.r, line.g, line.b];
        program.uniforms.uBaseColor.value = [base.r, base.g, base.b];
        program.uniforms.uIntensity.value = props.intensity * brightness;
        program.uniforms.uShineSize.value = (props.shineSize * Math.PI) / 180;
        program.uniforms.uShineFade.value = (props.shineFade * Math.PI) / 180;
        program.uniforms.uThickness.value = props.thickness * dpr;
        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(raf);
        resizeObserver?.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    } catch {
      // The CSS surface remains usable on browsers without WebGL or ResizeObserver.
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      return undefined;
    }
  }, []);

  const sharedProps = {
    ref: buttonRef,
    onClick: disabled ? (event) => event.preventDefault() : onClick,
    'aria-label': ariaLabel,
    'aria-disabled': href && disabled ? true : undefined,
    className: `specular-button specular-button--${size}${className ? ` ${className}` : ''}`,
    style: {
      '--sb-radius': `${radius}px`,
      '--sb-tint': tint,
      '--sb-tint-opacity': tintOpacity,
      '--sb-blur': `${blur}px`,
      '--sb-text-color': textColor,
      '--sb-base-color': baseColor,
      '--sb-surface': transparent ? 'transparent' : undefined,
    },
  };

  const label = <><span ref={fxRef} className="specular-button__fx" aria-hidden="true" /><span className="specular-button__label">{children}</span></>;
  if (href) {
    return <a {...sharedProps} href={disabled ? undefined : href} target={target} rel={rel} tabIndex={disabled ? -1 : undefined}>{label}</a>;
  }
  return <button {...sharedProps} type={type} disabled={disabled} form={form} name={name} value={value}>{label}</button>;
}
