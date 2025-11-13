/**
 * বিশেষ ফরম্যাটকে HTML স্ট্রিংয়ে রূপান্তরিত করে
 * প্রিন্ট এবং PDF-এর জন্য ব্যবহার করুন
 */
export function parseSpecialToHTML(text) {
  let result = text;

  // ✅ 1) Inline Code: `text`
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // ✅ 2) Subscript: _text_
  result = result.replace(/_([^_]+)_/g, "<sub>$1</sub>");

  // ✅ 3) Superscript: ^text^
  result = result.replace(/\^([^^]+)\^/g, "<sup>$1</sup>");

  // ✅ 4) Bold: **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

  // ✅ 5) Color: {color:red}text{/color}
  result = result.replace(
    /\{color:([^}]+)\}([^]+?)\{\/color\}/g,
    '<span style="color: $1;">$2</span>'
  );

  // ✅ 6) Overline: ~text~
  result = result.replace(
    /~([^~]+)~/g,
    '<span style="text-decoration: overline;">$1</span>'
  );

  return result;
}
