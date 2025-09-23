// 测试自定义路径编码函数
function encodePathComponent(str) {
  // 只编码真正需要编码的字符：空格、路径分隔符、查询参数分隔符等
  return str.replace(/[\s\/?#\[\]%]/g, (match) => {
    switch (match) {
      case ' ': return '%20';
      case '/': return '%2F';
      case '?': return '%3F';
      case '#': return '%23';
      case '[': return '%5B';
      case ']': return '%5D';
      case '%': return '%25';
      default: return match;
    }
  });
}

// 测试用例
const testCases = [
  'file@example.md',           // @ 符号不应该被编码
  'file with spaces.md',       // 空格应该被编码
  'folder/file.md',           // 路径分隔符应该被编码
  'file?query.md',            // 查询参数符号应该被编码
  'file#hash.md',             // 片段标识符应该被编码
  'file[bracket].md',         // 方括号应该被编码
  'file%percent.md',          // 百分号应该被编码
  '文件名中文.md',              // 中文字符不应该被编码
  'file@with+symbols&more.md', // @ + & 等符号不应该被编码
];

console.log('测试自定义路径编码函数:');
console.log('================================');

testCases.forEach(testCase => {
  const encoded = encodePathComponent(testCase);
  const builtinEncoded = encodeURIComponent(testCase);
  
  console.log(`原始: ${testCase}`);
  console.log(`自定义编码: ${encoded}`);
  console.log(`内置编码: ${builtinEncoded}`);
  console.log(`---`);
});
