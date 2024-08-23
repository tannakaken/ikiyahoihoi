import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { VFXProvider, VFXSpan } from 'react-vfx';
import { Novel } from './assets/novel.type';

type Props = {
    novel: Novel;
    id?: string;
}

const Char = ({char} : {char: string}) => {
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
        return <VFXSpan shader={"rgbShift"}>{char}</VFXSpan>
    } else {
        return <span>{char}</span>
    }
}

const VFXParagraph = ({content}: {content: string}) => {
    return [...content].map((char, index) => {
        return <Char char={char} key={`char-${index}`} />
    })
}

const Paragraph = ({content}: {content: string}) => {
    const elementRef = useRef<HTMLParagraphElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
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
            {isVisible ? <VFXParagraph content={content} /> : <span>{content}</span>}
        </div>
    )
}

const Root = ({body, num}: {body: string, num: number}) => <div>{
    body.split("\n").map((line, index) => {
        if (num < 30) {
            return <p key={`paragraph-${index}`}>{line}</p>
        }
        return <Paragraph content={line} key={`paragrap-${index}`} />
    })}</div>

export const Glitch = (props: Props) => {
    const [num, setNum] = useState(0);
    const data = useMemo(() => ({
        scrollY: 0,
    }), []);
    // リスナに登録する関数
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

    return <div id={props.id} className='container'>
            <VFXProvider>
                <Root body={props.novel.body} num={num} />
                {/* <VFXSpan shader={"rainbow"} overflow={100} uniforms={{
                    num: () => data.num,
                }}>
                    {props.novel.body}
                </VFXSpan> */}
            </VFXProvider>
        </div>
  }
