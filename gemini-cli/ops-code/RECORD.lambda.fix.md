# 修復 Lambda Function 超時問題

## 問題分析

根據 `ops-chat/RECORD.lambda.md` 的日誌，Lambda function `gemini-cli-lambda` 持續因為超時而失敗。

- **根本原因**: Function 的超時設定為 3 秒，但其程式碼中包含一個 `sleep(4)` 的呼叫，導致執行時間超過限制。
- **解決方案**: 我將修改 CDK 程式碼，將 Lambda function 的超時時間增加到 10 秒。

## 修復步驟

1.  **修改 CDK 程式碼**: 編輯 `lib/gemini-cli-stack.ts` 檔案，將 `timeout` 屬性從 3 秒增加到 10 秒。
2.  **部署變更**: 使用 `cdk deploy` 指令來應用更新。
