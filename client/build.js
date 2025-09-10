const esbuild = require('esbuild');
const fs = require('fs');

const isProd = process.argv.includes('--prod');

// JS 번들링
esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: isProd,
    write: false,
    platform: 'browser',
  })
  .then((result) => {
    const jsCode = result.outputFiles[0].text;

    // styles.css 읽어오기
    const cssCode = fs.readFileSync('public/styles.css', 'utf8');

    // HTML 생성
    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>SAMPLE GAME</title>
  <style>
${cssCode}
  </style>
</head>
<body>
  <!-- 로그인 폼 -->
  <div class="login-form">
    <input type="text" id="username" placeholder="username">
    <input type="password" id="password" placeholder="password">
    <button id="signin">SIGN IN</button>
  </div>

  <!-- 게임 영역 -->
  <div class="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>

  <!-- 채팅 영역 -->
  <div class="chat-container">
    <h3>채팅</h3>
    <div id="chat-box"></div>
    <div class="chat-input-row">
      <input type="text" id="chat-input" placeholder="메시지를 입력하세요">
      <button id="chat-send">보내기</button>
    </div>
  </div>

  <script>
${jsCode}
  </script>
</body>
</html>`;

    const outFile = isProd ? 'dist/index.html' : 'public/index.html';
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`Built to ${outFile}`);
  });
