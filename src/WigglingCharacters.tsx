import React, { useCallback, useEffect, useMemo, useState } from 'react'

type CharProps = {
  char: string;
  num: number;
}

type Transform = {
  scale: number;
  translateX: number;
  translateY: number;
  rotate: number,
}

const currentTransform = (transforms: Transform[]): Transform => {
  if (transforms.length === 0) {
    return {
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotate: 0,
    }
  }
  return transforms[transforms.length - 1];
}

const randomNumber = () => {
  return Math.random() - 0.5;
}

const Char = ({
  char,
  num,
}: CharProps) => {
  const transforms = useMemo<Transform[]>(() => [], []);
  useEffect(() => {
    if (num > transforms.length) {
      const transform = currentTransform(transforms);
      transforms.push({
        scale: transform.scale + randomNumber(),
        translateX: transform.translateX + randomNumber() * 10,
        translateY: transform.translateY + randomNumber() * 10,
        rotate: transform.rotate + randomNumber() * 10,
      });
    } else if (num < transforms.length) {
      transforms.pop();
    }
  }, [transforms, transforms.length, num]);
  const transform = currentTransform(transforms);
  return <span style={{
    display: 'inline-block',
    transform: `scale(${transform.scale}) rotate(${transform.rotate}deg)`,
    translate: `${transform.translateX}px ${transform.translateY}px`,
  }}>{char}</span>
}

type Props = {
    body: string;
    id?: string;
}

export const WigglingCharacters = (props: Props) => {

  const [num, setNum] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  // リスナに登録する関数
  const onScroll = useCallback(() => {
    if (window.scrollY < scrollY) {
      setNum((num) => num + 1);
    } else if (window.scrollY > scrollY) {
      setNum((num) => {
        if (num > 0) {
          return num - 1;
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
  }, [onScroll])

  return <div id={props.id}>{
      [...props.body].map((c, index) => {
          if (c === "\n") {
              return <br key={`char-${index}`} />
          }
          return <Char num={num} key={`char-${index}`} char={c} />
      })
  }</div>
}