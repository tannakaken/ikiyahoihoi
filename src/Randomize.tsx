import { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
    body: string;
    id?: string;
}

const randomize = (body: string, num = 3): string => {
    if (num === 0) {
        const i = Math.floor(Math.random() * body.length);
        const j = Math.floor(Math.random() * body.length);
        if (i < j) {
            return body.substring(0, i) + body.charAt(j) + body.substring(i + 1, j) + body.charAt(i) + body.substring(j + 1);
        }
        return body.substring(0, j) + body.charAt(i) + body.substring(j + 1, i) + body.charAt(j) + body.substring(i + 1);
    }
    return randomize(randomize(body, 0), num - 1);
}

export const Randomize = (props: Props) => {
  const histories = useMemo<string[]>(() => [], []);
  const [scrollY, setScrollY] = useState(0);
  // リスナに登録する関数
  const current = histories.length > 0 ? histories[histories.length - 1] : props.body;
  const onScroll = useCallback(() => {
    if (window.scrollY < scrollY) {
      histories.push(randomize(current));
    } else if (window.scrollY > scrollY) {
      if (histories.length > 0) {
        histories.pop();
      }
    }
    setScrollY(window.scrollY)
  }, [scrollY, current, histories])
  

  // 登録と後始末
  useEffect(() => {
    document.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  return <div id={props.id}>{
    current.split("\n").map((line, index) => 
        <p key={`line-${index}`}>{line}</p>
    )
  }</div>
}