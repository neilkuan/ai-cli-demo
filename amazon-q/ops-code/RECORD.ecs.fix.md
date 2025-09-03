# ECS Cluster 問題修復記錄

## 修復時間
2025-09-03 09:24 (UTC+8)

## 問題分析
根據 `../ops-chat/RECORD.ecs.md` 的分析，發現以下主要問題：

### 1. 記憶體限制過低 ❌
- **問題**: Container 記憶體限制 512MB，但應用程式分配 500MB
- **症狀**: 接近記憶體限制，可能導致 OOM 錯誤
- **影響**: Tasks 頻繁重啟（每分鐘一次）


## 修復方案

### 修復 1: 增加記憶體限制
```typescript
// 修復前
memoryLimitMiB: 512,

// 修復後  
memoryLimitMiB: 1024,
```
**理由**: 應用程式需要 500MB，增加到 1024MB 提供足夠緩衝空間


## 修改的檔案
- `./lib/amazon-q-stack.ts` - 主要 CDK stack 配置

## 部署指令
```bash
# 使用指定的 profile 和 region 部署
npx aws-cdk deploy --no-notices --require-approval never --profile neil --region ap-east-2
```

## 預期結果
1. ✅ Tasks 不再頻繁重啟
2. ✅ ECS Service 正確顯示 running tasks 數量
3. ✅ 容器有足夠記憶體運行應用程式
4. ✅ Health check 正常工作
5. ✅ 應用程式可通過 port 8080 訪問

## 驗證步驟
部署完成後，可執行以下指令驗證修復效果：

```bash
# 檢查 service 狀態
aws ecs describe-services --cluster amazon-q-cluster --services amazon-q-service --profile neil --region ap-east-2

# 檢查 tasks 狀態  
aws ecs list-tasks --cluster amazon-q-cluster --profile neil --region ap-east-2
aws ecs describe-tasks --cluster amazon-q-cluster --tasks <task-arn> --profile neil --region ap-east-2

# 檢查 logs
aws logs get-log-events --log-group-name amazon-q-log-group --log-stream-name <stream-name> --profile neil --region ap-east-2
```

## 注意事項
- 記憶體增加會影響成本，但對於測試環境是必要的
- 建議監控記憶體使用率，確保 1024MB 足夠
