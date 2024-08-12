import { useCallback, useEffect, useMemo, useState } from 'react'
import { Novel } from './assets/novel.type';

type CharProps = {
  char: string;
  num: number;
}

type Transform = {
  scale: number;
  opacity: number,
}

const currentTransform = (transforms: Transform[]): Transform => {
  if (transforms.length === 0) {
    return {
      scale: 1,
      opacity: 1,
    }
  }
  return transforms[transforms.length - 1];
}


const Char = ({
  char,
  num,
}: CharProps) => {
  const randomData = useMemo(() => ({
    speed: Math.random(),
    threashold: Math.floor(Math.random() * 60) + 5,
  }), [])
  const transforms = useMemo<Transform[]>(() => [], []);
  useEffect(() => {
    if (num > randomData.threashold + transforms.length) {
      const transform = currentTransform(transforms);
      transforms.push({
        scale: transform.scale + 0.1,
        opacity: transform.opacity * 0.9,
      });
    } else if (num < randomData.threashold + transforms.length) {
      transforms.pop();
    }
  }, [transforms, transforms.length, num, randomData.threashold]);
  const transform = currentTransform(transforms);
  return <span style={{
    display: 'inline-block',
    transform: `scale(${transform.scale})`,
    opacity: transform.opacity,
  }}>{char}</span>
}

type Props = {
    novel: Novel;
    id?: string;
}

export const Vanish = (props: Props) => {

  const [num, setNum] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  // リスナに登録する関数
  const onScroll = useCallback(() => {
    // 微調整
    const diff = Math.ceil(Math.abs(window.scrollY - scrollY) / 30);
    const effect = diff < 3 ? diff : 3;
    if (window.scrollY < scrollY) {
      setNum((num) => num + effect);
    } else if (window.scrollY > scrollY) {
      setNum((num) => {
        if (num > 0) {
          if (num < effect) {
            return 0;
          }
          return num - effect;
        }
        return num;
      })
    }
    setScrollY(window.scrollY)
  }, [scrollY])
  

  // 登録と後始末
  useEffect(() => {
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [onScroll]);
  const charList = useMemo(() => {
    return [...props.novel.body];
  }, [props.novel.body])

  return <div id={props.id}>
    <h2 style={{
      textAlign: "center"
    }}>{props.novel.title}</h2>{
    charList.map((c, index) => {
        if (c === "\n") {
            return <br key={`char-${index}`} />
        }
        return <Char num={num} key={`char-${index}`} char={c} />
    })
  }</div>
}