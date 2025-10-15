export function parseSpecialToJSX(text) {
  let parts = [text];

  const applyRegex = (items, regex, renderFn) => {
    const output = [];
    items.forEach((item) => {
      if (typeof item !== "string") {
        output.push(item);
        return;
      }

      let lastIndex = 0;
      let match;

      while ((match = regex.exec(item)) !== null) {
        const before = item.slice(lastIndex, match.index);
        if (before) output.push(before);

        output.push(renderFn(match));
        lastIndex = regex.lastIndex;
      }

      const after = item.slice(lastIndex);
      if (after) output.push(after);
    });

    return output;
  };

  // ✅ 1) Inline Code: `text`
  parts = applyRegex(parts, /`([^`]+)`/g, (m) => (
    <code key={parts.length}>{m[1]}</code>
  ));

  // ✅ 2) Subscript: _text_
  parts = applyRegex(parts, /_([^_]+)_/g, (m) => (
    <sub key={parts.length}>{m[1]}</sub>
  ));

  // ✅ 3) Superscript: ^text^
  parts = applyRegex(parts, /\^([^^]+)\^/g, (m) => (
    <sup key={parts.length}>{m[1]}</sup>
  ));

  // ✅ 4) Bold: **text**
  parts = applyRegex(parts, /\*\*([^*]+)\*\*/g, (m) => (
    <b key={parts.length}>{m[1]}</b>
  ));

  // ✅ 5) Color: {color:red}text{/color}
  parts = applyRegex(parts, /\{color:([^}]+)\}([^]+?)\{\/color\}/g, (m) => (
    <span style={{ color: m[1] }} key={parts.length}>
      {m[2]}
    </span>
  ));

  // ✅ 6) Overline: ~text~
  parts = applyRegex(parts, /~([^~]+)~/g, (m) => (
    <span style={{ textDecoration: "overline" }} key={parts.length}>
      {m[1]}
    </span>
  ));

  return parts;
}

// ১) Inline Code
// `text`

// ✅ ২) Subscript
// _text_

// ✅ ৩) Superscript
// ^text^

// ✅ ৪) Bold
// **text**

// ✅ ৫) Color
// {color:red}text{/color}

// ✅ ৬) Overline
// ~text~

// export function parseSpecialToJSX(text) {
//   const parts = [];

//   // রেজেক্স দিয়ে তিন ধরনের প্যাটার্ন ধরব
//   const regex = /`([^`]+)`|_([^_]+)_|\^([^^]+)\^/g;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     const before = text.slice(lastIndex, match.index);
//     if (before) parts.push(before);

//     if (match[1]) {
//       // `code`
//       parts.push(<code key={parts.length}>{match[1]}</code>);
//     } else if (match[2]) {
//       // _subscript_
//       parts.push(<sub key={parts.length}>{match[2]}</sub>);
//     } else if (match[3]) {
//       // ^superscript^
//       parts.push(<sup key={parts.length}>{match[3]}</sup>);
//     }

//     lastIndex = regex.lastIndex;
//   }

//   const after = text.slice(lastIndex);
//   if (after) parts.push(after);

//   return parts;
// }

// যখন বেশি ডাটা হবে।
// const parsedList = useMemo(
//   () => data.map(item => parseSpecialToJSX(item)),
//   [data]
// );
