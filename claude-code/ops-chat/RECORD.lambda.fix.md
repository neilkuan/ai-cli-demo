# AWS Lambda Function claude-code-lambda 超時問題修復記錄

## 修復時間
2025-09-03

## 問題描述
根據 RECORD.lambda.md 分析，Lambda 函數 `claude-code-lambda` 存在嚴重超時問題：
- 函數超時設定：3 秒
- 程式碼執行時間：4 秒 (sleep)
- 錯誤率：83.3% (10/12 次調用失敗)
- 所有失敗都因超時導致

## 修復方案
將 Lambda 函數超時時間從預設的 3 秒增加到 10 秒，確保有足夠時間完成 4 秒的 sleep 操作。

## 修復步驟

### 1. 檢查 CDK 程式碼
檢查 `/ops-code/lib/claude-code-stack.ts` 中的 Lambda 函數定義，發現缺少 `timeout` 配置。

### 2. 修改 CDK 配置
在 Lambda 函數定義中添加超時設定：

```typescript
const fn = new lambda.Function(this, 'Lambda', {
    functionName: 'claude-code-lambda',
    runtime: lambda.Runtime.PYTHON_3_13,
    handler: 'index.handler',
    timeout: cdk.Duration.seconds(10),  // 新增此行
    logGroup: new logs.LogGroup(this, 'LambdaLog', { 
        logGroupName: 'claude-code-lambda', 
        removalPolicy: cdk.RemovalPolicy.DESTROY
    }),
    code: new lambda.InlineCode(`
import time

def handler(event, context):
    print('Start to sleep 4s...')
    time.sleep(4)
    print('Done')
`)
})
```

### 3. 部署更新
執行 CDK 部署命令：

```bash
cdk deploy
```

部署結果：
- ✅ 部署成功
- 更新時間：約 27 秒
- Lambda 函數配置已更新

## 修復結果預期
- Lambda 超時時間：3 秒 → 10 秒
- 程式碼執行時間：4 秒 (不變)
- 預期錯誤率：83.3% → 0%
- 所有調用應能正常完成

## 後續監控建議
1. 監控 Lambda 函數執行狀況確認修復效果
2. 檢查 CloudWatch 日誌確認不再出現超時錯誤
3. 若需要，可進一步優化超時時間或程式碼邏輯

## 相關文件
- 原始問題分析：`RECORD.lambda.md`
- CDK 程式碼：`/ops-code/lib/claude-code-stack.ts`