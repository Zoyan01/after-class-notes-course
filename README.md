# 課後十分鐘

[直接看網站](https://after-class-ten-notes.workspace-047783.chatgpt.site) · [GitHub 專案](https://github.com/Zoyan01/after-class-notes-course) · [AI 協作規則](./AGENTS.md)

把生成式 AI 課程中容易忘記的觀念，整理成下課後看得懂的小筆記。

我想練習的不只是做出一個網頁，而是把新增內容的方法也留下來。先約好段落、資料欄位和檔案位置，下一次請 AI 協助寫筆記時，就不用再從零交代一次。

## 目前的成果

- 六篇完整筆記，分為「提示詞」、「觀念整理」、「動手做」。
- 首頁可搜尋全文、切換分類，沒有符合內容時會提示。
- 每篇文章都有白話解釋、三個重點、對照例子、兩個常見錯誤及下一步。
- 範例可複製；剪貼簿不可用時會選取文字，讓讀者手動複製。
- 手機版、關於頁、規則介紹頁與找不到文章的提示。
- [AGENTS.md](./AGENTS.md) 和 [新筆記範本](./templates/note-template.js)。

## 在自己的電腦開啟

最直接的方式是用瀏覽器開啟 index.html，不必安裝套件。完整的檢查與 HTTP 預覽需要先安裝 Node.js：

```sh
node scripts/check.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

再開啟終端機顯示的 http://127.0.0.1:4173 。按 Ctrl+C 停止預覽。網站本身不需要 Node.js 伺服器，Node.js 只用於本機工具。

## 怎麼新增一篇

1. 先讀 AGENTS.md，複製 templates/note-template.js 的物件。
2. 填好全部欄位後，加入 content/notes.js 的 STUDY_NOTES 陣列。
3. 不需要另外做 HTML。首頁、分類、全文搜尋與 note.html?id=新文章-id 會讀取新資料。
4. 執行檢查與建置，再用桌面和手機寬度看一次新文章。

可以直接對 AI 說：

> 請先讀 AGENTS.md，再幫這個站新增一篇「用 AI 整理報告大綱」，分類選「提示詞」。請沿用既有範本，執行檢查、建置，確認首頁搜尋與文章連結都能找到它。

## GitHub Pages 發布

1. 建立名為 after-class-notes 的 public Repository。
2. 上傳本資料夾內的完整檔案到 Repository 根目錄，包含 AGENTS.md、assets/、content/、.nojekyll 等。不要把最外層 after-class-notes 資料夾再包進去。
3. 進入 Settings → Pages，Source 選 Deploy from a branch，Branch 選 main、/(root)，然後儲存。
4. 等待部署完成後，開啟 Pages 提供的實際網址，測試首頁和文章。
5. 分別記下 Repository 連結與網站連結，用來繳交。

不需要提交 dist/，GitHub Pages 可以直接讀取根目錄的靜態網頁；若用 Sites 發布，則由 scripts/build.mjs 產生 dist/。公開網址應以部署成功的結果為準。

官方說明：[建立 GitHub Pages 網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 專案結構

```text
├─ AGENTS.md              AI 協作規則
├─ README.md              本文件
├─ index.html             首頁
├─ note.html              共用文章頁
├─ about.html             關於網站
├─ rules.html             新增筆記規則
├─ 404.html               找不到頁面
├─ assets/                共用樣式、互動與自製 SVG 插圖
├─ content/notes.js        六篇筆記與之後新增的內容
├─ templates/             新增筆記的物件範本
└─ scripts/               檢查、建置、預覽工具
```

## 規則怎麼幫助 AI 繼續做

AGENTS.md 明確規定讀者、語氣、色票、五段文章結構與資料欄位，還寫明改哪個檔案、如何命名，以及完成前要驗證什麼。新文章共用同一份版型，只新增資料就能接上原本的網站；真的要改版時，也能一次調整所有文章。

這次的內容與程式由 AI 協助起草；作者應在繳交前確認內容、理解檔案分工，並依自己的實際想法修改。沒有虛構學校、姓名或個人修課經歷。

## 素材與相依項目

插圖與圖示是本專案自製的 SVG。字型使用 Google Fonts 的 Noto Sans TC，無法連線時會改用系統中文字型。網站沒有第三方 JavaScript 套件、追蹤工具、帳號或後端。
