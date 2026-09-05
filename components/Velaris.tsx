"use client";

import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3 u_colors[4];
uniform vec3 u_bg;

vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;
  vec3 ox=floor(x+.5);vec3 a0=x-ox;m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
void main(){
  vec2 p=vUv-.5;p.x*=u_resolution.x/u_resolution.y;
  float t=u_time*.035;
  float n1=snoise(p*.75+vec2(t,-t*.7));
  float n2=snoise(p*.58+vec2(-t*.6,t*.8)+n1*.18);
  float n3=snoise(p*.9+vec2(t*.4,-t*.5)+n2*.12);
  vec3 col=u_bg;
  col=mix(col,u_colors[0],smoothstep(-.55,.75,n1)*.42);
  col=mix(col,u_colors[1],smoothstep(-.4,.8,n2)*.34);
  col=mix(col,u_colors[2],smoothstep(-.1,.75,n3)*.27);
  col=mix(col,u_colors[3],smoothstep(.15,.9,n1*n2)*.18);
  float grain=fract(sin(dot(vUv,vec2(12.9898,78.233)))*43758.5453+u_time);
  col+=(grain-.5)*u_grain*.022;
  gl_FragColor=vec4(col,1.);
}
`;

type VelarisProps = {
  bg?: string;
  colors?: string[];
  speed?: number;
  grain?: number;
  height?: string;
  className?: string;
  children?: React.ReactNode;
};

const BRAND_COLORS = ["#FFFFFF", "#BAC3EA", "#E8D79B", "#D8DDF3"];

export default function Velaris({
  bg = "#F8F5ED",
  colors = BRAND_COLORS,
  speed = 0.7,
  grain = 0.18,
  height = "100vh",
  className = "relative",
  children,
}: VelarisProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);gl.compileShader(shader);return shader;
    };
    const vert = compile(gl.VERTEX_SHADER, vertexShader);
    const frag = compile(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    if (!vert || !frag || !program) return;
    gl.attachShader(program, vert);gl.attachShader(program, frag);gl.linkProgram(program);gl.useProgram(program);
    const buffer = gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program,"position");
    gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const res=gl.getUniformLocation(program,"u_resolution");
    const time=gl.getUniformLocation(program,"u_time");
    const grainLoc=gl.getUniformLocation(program,"u_grain");
    const colorLoc=gl.getUniformLocation(program,"u_colors");
    const bgLoc=gl.getUniformLocation(program,"u_bg");
    const rgb=(hex:string):[number,number,number]=>{const h=hex.replace("#","");return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255]};
    const palette=[...colors,...BRAND_COLORS].slice(0,4);
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio,2);canvas.width=container.clientWidth*dpr;canvas.height=container.clientHeight*dpr;gl.viewport(0,0,canvas.width,canvas.height)};
    const observer=new ResizeObserver(resize);observer.observe(container);resize();
    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame=0;
    const render=(now:number)=>{gl.uniform2f(res,canvas.width,canvas.height);gl.uniform1f(time,reduceMotion?0:now*.001*speed);gl.uniform1f(grainLoc,grain);gl.uniform3f(bgLoc,...rgb(bg));gl.uniform3fv(colorLoc,new Float32Array(palette.flatMap(rgb)));gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!reduceMotion)frame=requestAnimationFrame(render)};
    frame=requestAnimationFrame(render);
    return()=>{observer.disconnect();cancelAnimationFrame(frame);gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vert);gl.deleteShader(frag)};
  },[bg,colors,speed,grain]);

  return <div ref={containerRef} style={{height,backgroundColor:bg}} className={`w-full overflow-hidden ${className}`}><canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full"/><div className="relative z-10 h-full w-full">{children}</div></div>;
}
