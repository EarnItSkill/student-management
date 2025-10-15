import { parseSpecialToJSX } from "../utils/parseSpecialToJSX";

export default function Code() {
  const data = [
    "Water is H_2_O",
    "Einstein said E = mc^2^",
    "Use `console.log()` for debugging`",
    "`const parsedList = useMemo(`",
    "`() => data.map(item => parseSpecialToJSX(item)),`",
    "`[data]`",
    "`);`",
  ];
  return (
    <div>
      {data.map((item, index) => (
        <p key={index}>{parseSpecialToJSX(item)}</p>
      ))}
    </div>
  );
}
