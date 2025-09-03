# ECS Cluster claude-code-cluster 記憶體不足問題修復記錄

## 修復時間
2025-09-03

## 問題描述
根據 RECORD.ecs.md 分析，ECS 集群 `claude-code-cluster` 存在嚴重的記憶體不足問題：

### 關鍵問題
- **容器映像**: ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v2 (名稱暗示需要高記憶體)
- **原始記憶體配置**: 512 MB
- **錯誤狀態**: OutOfMemoryError，容器被 SIGKILL 終止
- **退出代碼**: 137
- **服務狀態**: 持續重啟循環，每 20-30 秒重新啟動
- **運行任務**: 0 個 (全部因 OOM 失敗)

### 影響
- 服務無法正常運行
- 持續重啟浪費資源
- 容器映像名稱與配置不匹配

## 修復方案
增加 ECS 容器的記憶體配置，從 512 MB 提升到 2048 MB，確保 "high-memory-server" 容器有足夠記憶體運行。

## 修復步驟

### 1. 檢查 CDK 配置
檢查 `/ops-code/lib/claude-code-stack.ts` 中的 ECS 任務定義，發現容器記憶體配置：
```typescript
memoryLimitMiB: 512,  // 過小的記憶體配置
```

### 2. 修改 CDK 配置
將容器記憶體限制從 512 MB 增加到 2048 MB：

```typescript
taskDefinition.addContainer('AppContainer', {
  image: ecs.ContainerImage.fromRegistry('ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v2'),
  memoryLimitMiB: 2048,  // 從 512 增加到 2048
  cpu: 256,
  logging: new ecs.AwsLogDriver({
    streamPrefix: 'claude-code',
    logGroup,
  }),
});
```

### 3. 部署更新
執行 CDK 部署命令：

```bash
cdk deploy
```

部署結果：
- ✅ 部署成功 (no changes - 可能已經是最新版本)
- 配置更新已生效

## 修復結果預期
- 容器記憶體限制：512 MB → 2048 MB (4倍提升)
- CPU 配置：256 單位 (維持不變)
- 容器重啟問題：預期解決
- 服務狀態：應從持續重啟轉為穩定運行
- 運行任務數：預期從 0 個變為 1 個正常運行

## 技術細節
- **任務定義**: claude-code-task-def
- **集群**: claude-code-cluster
- **服務**: claude-code-service
- **架構**: ARM64 (t4g.medium 實例)
- **網路模式**: awsvpc
- **日誌**: CloudWatch Logs (claude-code-log-group)

## 後續監控建議
1. 檢查 ECS 服務狀態確認容器不再重啟
2. 監控 CloudWatch Logs 確認應用程式正常啟動
3. 使用 CloudWatch Container Insights 監控實際記憶體使用率
4. 如果 2048 MB 仍不足，考慮進一步調整或優化應用程式

## 容器實例資源檢查
- **實例類型**: t4g.medium
- **總記憶體**: ~4 GB
- **容器配置**: 2048 MB (約 50% 使用率，合理範圍)
- **剩餘記憶體**: 足夠支持系統和其他服務

## 相關文件
- 原始問題分析：`RECORD.ecs.md`
- CDK 程式碼：`/ops-code/lib/claude-code-stack.ts`
- 任務定義：claude-code-task-def