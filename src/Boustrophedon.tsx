import { Novel } from './assets/novel.type';
import { Link } from 'react-router-dom';

type Props = {
    novel: Novel;
    id?: string;
}

const splitStringByLength = (line: string, length = 32, acc: [string, boolean][] = []): [string, boolean][] => {
  if (line.length <= length) {
    return [...acc, [line, false]];
  } else {
    const rest = line.substring(length);
    const head = line.substring(0, length)
    return splitStringByLength(rest, length, [...acc, [head, true]]);
  }
}

export const Boustrophedon = (props: Props) => {
  let left = false;
  const lineLength = window.innerWidth < 720 ? 14 : 32;
  return (<>
  <div>
    <Link to="/">&lt;戻る</Link>
  </div>
  <h2 className='title'>{props.novel.title}</h2>
  <div id={props.id} className='container'>
  {props.novel.body.split("\n").map((line, index) => (<div key={`line-${index}`}>{splitStringByLength(line, lineLength).map(([subline, full], index) => {
    left = !left;
    return (<div key={`subline-${index}`} style={{
      display: "inline-block",
      textAlignLast: full ? "justify" : "left",
      transform: left ? undefined : "scale(-1, 1)",
      width: "100%",
    }}>{subline}</div>);
  })}</div>))}</div>
  <h3  style={{
    textAlign: "center",
    color: "black",
  }}>解説</h3>
  <div className={"afterword"}>
    {"　"}牛耕式、つまり一行ずつ読む方向が変わる小説
    {"　"}古代ギリシャやインダス文字など、古代の文字体系ではよく使われたが、なぜか廃れてしまった。
  </div>
  <div>
    <Link to="/">&lt;戻る</Link>
  </div>
  </>);
}