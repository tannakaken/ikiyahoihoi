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
  <h2 style={{
    textAlign: "center",
    backgroundColor: "white",
  }}>{props.novel.title}</h2>
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
  <h3 style={{
    textAlign: "center"
  }}>解説</h3>
  <div className={"afterword"} style={{
    background: "white",
    padding: "1rem",
  }}>
    {"　"}戻ると消える小説。<br />
    {"　"}ゆっくりスクロールする場合と速くスクロールする場合の違いを微調整したりした。
    {"　"}一つ一つの文字を分解して、spanタグに包んでいるため、禁則処理が無効になってしまうことに驚いた。<br />
    {"　"}分解の差異に、句読点や役物は特別扱いすることで、なんとかした。
  </div>
  <div>
    <Link to="/">&lt;戻る</Link>
  </div>
  </>);
}