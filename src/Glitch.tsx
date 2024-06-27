import { useCallback, useEffect, useMemo } from 'react'
import { VFXDiv, VFXProvider } from 'react-vfx';

const shader = `
precision mediump float;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform int num; // custom uniform passed as props
uniform sampler2D src;

float inside(in vec2 uv) {
    return step(0., uv.x) * step(uv.x, 1.) * step(0., uv.y) * step(uv.y, 1.);
}

vec4 draw(vec2 uv) {
    vec2 uvr = uv, uvg = uv, uvb = uv;

    float amp = 20. / resolution.x;

    uvr.x += sin(uv.y * 7. + time * 3.) * amp;
    uvg.x += sin(uv.y * 7. + time * 3. + .4) * amp;
    uvb.x += sin(uv.y * 7. + time * 3. + .8) * amp;

    vec4 cr = texture2D(src, uvr) * inside(uvr);
    vec4 cg = texture2D(src, uvg) * inside(uvg);
    vec4 cb = texture2D(src, uvb) * inside(uvb);

    return vec4(
        cr.r,
        cg.g,
        cb.b,
        cr.a + cg.a + cb.a
    );
}

float nn(float y, float t) {
    float n = (
        sin(y * .07 + t * 8. + sin(y * .5 + t * 10.)) +
        sin(y * .7 + t * 2. + sin(y * .3 + t * 8.)) * .7 +
        sin(y * 1.1 + t * 2.8) * .4
    );

    n += sin(y * 124. + t * 100.7) * sin(y * 877. - t * 38.8) * .3;

    return n;
}

void main (void) {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    if (num == 0) {
        gl_FragColor = texture2D(src, uv);
    } else {
        vec2 dx = vec2(2, 0) / resolution.x;
        uv = (uv - .01 * float(num)) * (1. + (0.001) * float(num) + sin(time * 3.14) * 0.001 * float(num)) + .01 * float(num);
        if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) { discard; }

        vec4 color = (draw(uv) * 2. + draw(uv + dx) + draw(uv - dx)) / 4.;
        if (num < 20) {
            gl_FragColor = color;
        } else {
            // vec4 color = texture2D(src, uv);
            float t = mod(time, 3.14 * 10.);

            // Seed value
            float v = fract(sin(t * 2.) * 700.);

            if (abs(nn(uv.y, t)) < 1.2) {
                v *= 0.01;
            }

            // Prepare for chromatic Abbreveation
            vec2 focus = vec2(0.5);
            float d = v * 0.6;
            vec2 ruv = focus + (uv - focus) * (1. - d);
            vec2 guv = focus + (uv - focus) * (1. - 2. * d);
            vec2 buv = focus + (uv - focus) * (1. - 3. * d);

            // Random Glitch
            if (v > 0.1) {
                // Randomize y
                float y = floor(uv.y * 13. * sin(35. * t)) + 1.;
                if (sin(36. * y * v) > 0.9) {
                    ruv.x = uv.x + sin(76. * y) * 0.1;
                    guv.x = uv.x + sin(34. * y) * 0.1;
                    buv.x = uv.x + sin(59. * y) * 0.1;
                }

                // RGB Shift
                v = pow(v * 1.5, 2.) * 0.15;
                color.rgb *= 0.3;
                color.r += texture2D(src, vec2(uv.x + sin(t * 123.45) * v, uv.y)).r;
                color.g += texture2D(src, vec2(uv.x + sin(t * 157.67) * v, uv.y)).g;
                color.b += texture2D(src, vec2(uv.x + sin(t * 143.67) * v, uv.y)).b;
            }

            // Compose Chromatic Abbreveation
            if (abs(nn(uv.y, t)) > 1.1) {
                color.r = color.r * 0.5 + color.r * texture2D(src, ruv).r;
                color.g = color.g * 0.5 + color.g * texture2D(src, guv).g;
                color.b = color.b * 0.5 + color.b * texture2D(src, buv).b;
                color *= 2.;
            }

            gl_FragColor = color;
            gl_FragColor.a = smoothstep(0.0, 0.8, max(color.r, max(color.g, color.b)));
            if (num > 40) {
                float b = sin(time * 2.) * 32. + 48.;
                uv = floor(uv * b) / b;
                gl_FragColor += texture2D(src, uv);
            }
        }
    }
}
`;

type Props = {
    body: string;
    id?: string;
}

const text =`こんにちは
こんにちはは
こんにちはははははは
ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あ
ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああ
ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ`;

const Root = ({body}: {body: string}) => <div>{
    body.split("\n").map((line, index) => 
                <p key={`line-${index}`}>{line}</p>
            )
        }</div>

export const Glitch = (props: Props) => {
    const data = useMemo(() => ({
        num: 0,
        scrollY: 0,
    }), []);
    // リスナに登録する関数
    const onScroll = useCallback(() => {
      if (window.scrollY < data.scrollY) {
        data.num++;
      } else if (window.scrollY > data.scrollY) {
        if (data.num > 0) {
            data.num--;
        }
      }
      data.scrollY = window.scrollY;
    }, [data])
    
  
    // 登録と後始末
    useEffect(() => {
      document.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        document.removeEventListener('scroll', onScroll)
      }
    }, [onScroll])

    return <div id={props.id}>  {/* 幅が狭すぎるとWebGLのエラーが起こる。とりあえずの処置 */}
            <VFXProvider>
                <VFXDiv shader={shader} overflow={100} id={props.id} uniforms={{
                    num: () => data.num,
                }}>
                    <Root body={text || props.body} />
                </VFXDiv>
            </VFXProvider>
        </div>
  }
