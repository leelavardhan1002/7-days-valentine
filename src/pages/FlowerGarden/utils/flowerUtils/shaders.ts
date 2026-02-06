export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.);
  }
`;

export const fragmentShader = `
  #define PI 3.14159265359
  uniform float u_ratio;
  uniform vec2 u_cursor;
  uniform float u_stop_time;
  uniform float u_clean;
  uniform vec2 u_stop_randomizer;
  uniform float u_theme;
  uniform sampler2D u_texture;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float get_flower_shape(vec2 _p, float _pet_n, float _angle, float _outline) {
    _angle *= 3.;
    _p = vec2(_p.x * cos(_angle) - _p.y * sin(_angle), _p.x * sin(_angle) + _p.y * cos(_angle));
    float a = atan(_p.y, _p.x);
    float petal_variation = 0.15 * sin(a * _pet_n * 2.0);
    float flower_sectoral_shape = pow(abs(sin(a * _pet_n)), .35) + .2 + petal_variation;
    vec2 flower_size_range = vec2(.04, .12);
    float size = flower_size_range[0] + u_stop_randomizer[0] * flower_size_range[1];
    float flower_radial_shape = pow(length(_p) / size, 1.8);
    flower_radial_shape -= .12 * sin(8. * a + u_stop_randomizer[1] * 6.28);
    flower_radial_shape = max(.08, flower_radial_shape);
    flower_radial_shape += smoothstep(0., 0.025, -_p.y + .18 * abs(_p.x));
    float grow_time = step(.25, u_stop_time) * pow(u_stop_time, .25);
    float flower_shape = 1. - smoothstep(0., flower_sectoral_shape, _outline * flower_radial_shape / grow_time);
    flower_shape *= (1. - step(1., grow_time));
    return flower_shape;
  }

  float get_stem_shape(vec2 _p, vec2 _uv, float _w, float _angle) {
    _w = max(.003, _w);
    float x_offset = _p.y * sin(_angle);
    x_offset *= pow(3. * _uv.y, 2.);
    _p.x -= x_offset;
    float noise_power = .4;
    float cursor_horizontal_noise = noise_power * snoise(2.5 * _uv * u_stop_randomizer[0]);
    cursor_horizontal_noise *= pow(dot(_p.y, _p.y), .5);
    cursor_horizontal_noise *= pow(dot(_uv.y, _uv.y), .25);
    _p.x += cursor_horizontal_noise;
    float left = smoothstep(-_w, 0., _p.x);
    float right = 1. - smoothstep(0., _w, _p.x);
    float stem_shape = left * right;
    float grow_time = 1. - smoothstep(0., .18, u_stop_time);
    float stem_top_mask = smoothstep(0., pow(grow_time, .45), .035 -_p.y);
    stem_shape *= stem_top_mask;
    stem_shape *= (1. - step(.17, u_stop_time));
    return stem_shape;
  }

  void main() {
    vec3 base = texture2D(u_texture, vUv).xyz;
    vec2 uv = vUv;
    uv.x *= u_ratio;
    vec2 cursor = vUv - u_cursor.xy;
    cursor.x *= u_ratio;
    vec3 stem_color = vec3(.15 + u_stop_randomizer[0] * .4, .65, .25);
    float color_type = floor(u_stop_randomizer[1] * 4.0);
    vec3 flower_color;
    if (color_type < 1.0) flower_color = vec3(.85, .15, .25);
    else if (color_type < 2.0) flower_color = vec3(.95, .45, .55);
    else if (color_type < 3.0) flower_color = vec3(.95, .75, .2);
    else flower_color = vec3(.7, .4, .85);
    flower_color += vec3(u_stop_randomizer[0] * 0.1 - 0.05);
    float angle = .5 * (u_stop_randomizer[0] - .5);
    float stem_shape = get_stem_shape(cursor, uv, .004, angle);
    float stem_mask = 1. - get_stem_shape(cursor, uv, .005, angle);
    float petals_back_number = 2. + floor(u_stop_randomizer[0] * 3.);
    float angle_offset = -(2. * step(0., angle) - 1.) * .08 * u_stop_time;
    float flower_back_shape = get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.4);
    float flower_back_mask = 1. - get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.5);
    float petals_front_number = 3. + floor(u_stop_randomizer[1] * 3.);
    float flower_front_shape = get_flower_shape(cursor, petals_front_number, angle, 1.);
    float flower_front_mask = 1. - get_flower_shape(cursor, petals_front_number, angle, .92);
    vec3 color = base;
    color *= stem_mask * flower_back_mask * flower_front_mask;
    color += stem_shape * stem_color;
    color += flower_back_shape * flower_color * 0.7;
    color += flower_front_shape * flower_color;
    color *= u_clean;
    gl_FragColor = vec4(color, 1.);
  }
`;
