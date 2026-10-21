/* Stripe-like flowing ribbon (WebGL). Static single frame under reduced motion,
   paused when the tab is hidden; CSS gradients remain if WebGL is unavailable. */
(() => {
  const canvas = document.getElementById("ribbon");
  const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
  if (!gl) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vs = "attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }";
  const fs = `precision highp float;
  uniform vec2 r; uniform float t;
  vec3 hash3(vec2 p){ vec3 q = vec3(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9))); return fract(sin(q)*43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
    float a=dot(hash3(i).xy-.5, f), b=dot(hash3(i+vec2(1,0)).xy-.5, f-vec2(1,0)), c=dot(hash3(i+vec2(0,1)).xy-.5, f-vec2(0,1)), d=dot(hash3(i+vec2(1,1)).xy-.5, f-vec2(1,1));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=.5; } return v; }
  vec3 pal(float x){ // violet → indigo → teal → amber → rose
    vec3 a = vec3(.43,.37,.96), b = vec3(.33,.55,1.0), c = vec3(.23,.84,.77), d = vec3(.98,.74,.36), e = vec3(.96,.45,.72);
    x = fract(x);
    if (x < .25) return mix(a,b,x*4.); if (x < .5) return mix(b,c,(x-.25)*4.); if (x < .75) return mix(c,d,(x-.5)*4.); return mix(d,e,(x-.75)*4.);
  }
  void main(){
    vec2 uv = gl_FragCoord.xy / r.xy; vec2 p = uv; p.x *= r.x / r.y;
    float tt = t * .16;
    vec3 col = vec3(0.);
    for (int i = 0; i < 34; i++) {
      float fi = float(i) / 33.;
      vec2 P = r.x > r.y ? p : vec2(uv.x * 1.6, uv.y * .9 + .12);   // portrait: same sweep, upper hero
      float x = P.x;
      float y = .60 + (x - .75) * .95                       // sweep up through the top-right of the hero
              + .16 * sin(x * 2.1 + fi * 2.6 + tt)         // the fold
              + .07 * sin(x * 4.3 - fi * 5.0 + tt * 1.7)
              + .12 * fbm(vec2(x * .8 + fi * .6, tt * .35))
              + (fi - .5) * .62;
      float dd = abs(P.y - y);
      float w = .0022 + .007 * fi;
      float line = exp(-dd * dd / (w * w)) * .9 + exp(-dd * dd / (w * w * 90.)) * .10;   // core + soft glow
      col += pal(fi * .85 + x * .22 + tt * .03) * line * (.22 + .40 * fi);
    }
    col = 1. - exp(-col * 1.05);                            // gentle tone map, no white-out
    col = mix(vec3(dot(col, vec3(.33))), col, 1.35);        // a touch more saturation
    col *= r.x > r.y ? smoothstep(.46, .80, uv.x)           // desktop: the headline side stays dark
                     : .45 * smoothstep(-.3, 1.0, uv.x);    // phone: soft, behind the text
    col *= 1. - smoothstep(.90, 1.0, uv.y);                 // clear of the menu bar
    col *= smoothstep(.0, .18, uv.y);
    gl_FragColor = vec4(col, 1.);
  }`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t");
  const scale = Math.min(1, 1.25 / (devicePixelRatio || 1));   // render at reduced resolution; it is soft anyway
  const size = () => { canvas.width = Math.round(canvas.clientWidth * scale); canvas.height = Math.round(canvas.clientHeight * scale); gl.viewport(0, 0, canvas.width, canvas.height); };
  const draw = (ms) => { gl.uniform2f(uR, canvas.width, canvas.height); gl.uniform1f(uT, ms / 1000 + 40); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  size(); addEventListener("resize", () => { size(); if (reduce) draw(0); });
  if (reduce) { draw(0); return; }
  let raf; const loop = (ms) => { draw(ms); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(loop); });
})();
