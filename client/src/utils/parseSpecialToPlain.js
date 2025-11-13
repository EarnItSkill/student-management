/**
 * বিশেষ ফরম্যাটকে সাধারণ টেক্সটে রূপান্তরিত করে
 * PDF-এর জন্য ব্যবহার করুন (শুধু ফরম্যাটিং মার্ক খুলে দেয়, স্টাইল রাখে না)
 */
export function parseSpecialToPlain(text) {
  let result = text;

  // ✅ 1) Inline Code: `text` → text
  result = result.replace(/`([^`]+)`/g, "$1");

  // ✅ 2) Subscript: _text_ → text
  result = result.replace(/_([^_]+)_/g, "$1");

  // ✅ 3) Superscript: ^text^ → text
  result = result.replace(/\^([^^]+)\^/g, "$1");

  // ✅ 4) Bold: **text** → text
  result = result.replace(/\*\*([^*]+)\*\*/g, "$1");

  // ✅ 5) Color: {color:red}text{/color} → text
  result = result.replace(/\{color:[^}]+\}([^]+?)\{\/color\}/g, "$1");

  // ✅ 6) Overline: ~text~ → text
  result = result.replace(/~([^~]+)~/g, "$1");

  return result;
}
