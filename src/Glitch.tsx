import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as ReactVFX from 'react-vfx';
import { Novel } from './assets/novel.type';

type Props = {
    novel: Novel;
    id?: string;
}

const myRgbShift = `
    precision highp float;
    uniform vec2 resolution;
    uniform vec2 offset;
    uniform float time;
    uniform int num; // custom uniform passed as props
    uniform sampler2D src;

    float nn(float y, float t) {
        float n = (
            sin(y * .07 + t * 8. + sin(y * .5 + t * 10.)) +
            sin(y * .7 + t * 2. + sin(y * .3 + t * 8.)) * .7 +
            sin(y * 1.1 + t * 2.8) * .4
        ) * (float(num) / 30.0) * (float(num) / 30.0);

        n += sin(y * 124. + t * 100.7) * sin(y * 877. - t * 38.8) * .3;

        return n;
    }

    float step2(float t, vec2 uv) {
        return step(t, uv.x) * step(t, uv.y);
    }

    float inside(vec2 uv) {
        return step2(0., uv) * step2(0., 1. - uv);
    }

    void main (void) {
        vec2 uv = (gl_FragCoord.xy - offset) / resolution;
        vec2 uvr = uv, uvg = uv, uvb = uv;

        float t = mod(time, 30.);

        float amp = 10. / resolution.x;

        if (abs(nn(uv.y, t)) > 1.) {
            uvr.x += nn(uv.y, t) * amp;
            uvg.x += nn(uv.y, t + 10.) * amp;
            uvb.x += nn(uv.y, t + 20.) * amp;
        }

        vec4 cr = texture2D(src, uvr) * inside(uvr);
        vec4 cg = texture2D(src, uvg) * inside(uvg);
        vec4 cb = texture2D(src, uvb) * inside(uvb);

        gl_FragColor = vec4(
            cr.r,
            cg.g,
            cb.b,
            smoothstep(.0, 1., cr.a + cg.a + cb.a)
        );
    }
    `;

/**
 * 大きな文字列に{@link ReactVFX.VFXSpan}や{@link ReactVFX.VFXDiv}を使うと、
 * なぜか右側や下部が欠けたり、スマホなどの細長い画面で表示したときに、
 * 「webgl gl_invalid_value: desired resource size is greater than max texture size.」
 * のようなWebGLのエラーが起きたりする。
 * いろいろ、試行錯誤をしたが、これならどうやら動くようだ。
 */
const Char = ({char, num} : {char: string, num: number}) => {
    const [seed, setSeed] = useState(Math.random());
    const requestIdRef = useRef<number>();
    useEffect(() => {
        const animation = () => {
            setSeed(Math.random());
            requestIdRef.current = requestAnimationFrame(animation);
        }
        animation();
        return () => {
            if (requestIdRef.current !== null && requestIdRef.current !== undefined) {
                cancelAnimationFrame(requestIdRef.current);
            }
        }
    }, [])
    if (seed <= 1.0) {
        return <ReactVFX.VFXSpan uniforms={{
            num: () => num,
        }} shader={myRgbShift}>{char}</ReactVFX.VFXSpan>
    } else {
        return <span>{char}</span>
    }
}

const VFXParagraph = ({content, num}: {content: string; num: number}) => {
    return [...content].map((char, index) => {
        return <Char char={char} key={`char-${index}`} num={num} />
    })
}

/**
 * あまりに大量の{@link VFXReact.VFXSpan}や{@link VFXReact.VFXDiv}を表示すると、
 * 「omg」というエラーを出して、落ちてしまうので、
 * 画面の外にある部分は通常のUI要素にした。
 */
const Paragraph = ({content, num}: {content: string; num: number}) => {
    const elementRef = useRef<HTMLParagraphElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        /**
         * スクロールを検知して、自分が現在画面の中にいるかどうかを調べる。
         */
        const handleScroll = () => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const notVisible = (
                    rect.bottom <= 0
                ) || (
                    rect.top >= (window.innerHeight || document.documentElement.clientHeight)
                );
                setIsVisible(!notVisible);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check on component mount
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    } , []);
    return (
        <div ref={elementRef}>
            {isVisible ? <VFXParagraph content={content} num={num} /> : <span>{content}</span>}
        </div>
    )
}

const Root = ({body, num}: {body: string, num: number}) => <div>{
    body.split("\n").map((line, index) => {
        if (num < 30) {
            return <p key={`paragraph-${index}`}>{line}</p>
        }
        return <Paragraph content={line} key={`paragrap-${index}`} num={num} />
    })}</div>

    
export const Glitch = (props: Props) => {
    const [num, setNum] = useState(0);
    const data = useMemo(() => ({
        scrollY: 0,
    }), []);
    /**
     * スクロールでの戻るを検知する。
     */
    const onScroll = useCallback(() => {
      if (window.scrollY < data.scrollY) {
        setNum(num + 1)
      } else if (window.scrollY > data.scrollY) {
        if (num > 0) {
            setNum(num - 1);
        }
      }
      data.scrollY = window.scrollY;
    }, [data, num])
    
  
    // 登録と後始末
    useEffect(() => {
      document.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        document.removeEventListener('scroll', onScroll)
      }
    }, [onScroll])
    console.warn(num);

    return <div id={props.id} className='container'>
            <ReactVFX.VFXProvider>
                <Root body={props.novel.body} num={num} />
            </ReactVFX.VFXProvider>
        </div>
  }
