# ECS Cluster Analysis Report - claude-code-cluster

## 概要
分析 ECS claude-code-cluster 在 ap-east-2 區域的狀態，發現嚴重的記憶體不足問題導致容器持續重啟。

## 使用的工具和指令
- `aws ecs describe-clusters --cluster claude-code-cluster --region ap-east-2 --profile neil`
- `aws ecs list-services --cluster claude-code-cluster --region ap-east-2 --profile neil`
- `aws ecs describe-services --cluster claude-code-cluster --services claude-code-service --region ap-east-2 --profile neil`
- `aws ecs list-tasks --cluster claude-code-cluster --region ap-east-2 --profile neil`
- `aws ecs describe-tasks --cluster claude-code-cluster --tasks [task-id] --region ap-east-2 --profile neil`
- `aws ecs describe-task-definition --task-definition claude-code-task-def:9 --region ap-east-2 --profile neil`

## 集群基本狀態

### 集群總覽
- **集群名稱**: claude-code-cluster
- **狀態**: ACTIVE
- **註冊容器實例**: 1 個
- **正在運行任務**: 0 個 ⚠️
- **待處理任務**: 1 個 ⚠️
- **活躍服務**: 1 個

## 服務分析

### claude-code-service
- **狀態**: ACTIVE
- **期望任務數**: 1
- **實際運行任務數**: 1 (但任務狀態有問題)
- **待處理任務數**: 0
- **啟動類型**: EC2
- **任務定義**: claude-code-task-def:9

## 🚨 關鍵問題發現

### 記憶體不足問題
**根本原因**: 容器因記憶體不足被終止
- **錯誤訊息**: `OutOfMemoryError: Container killed due to memory usage`
- **退出代碼**: 137 (表示被 SIGKILL 終止)
- **分配記憶體**: 512 MB
- **容器映像**: ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v2

### 持續重啟循環
服務事件顯示容器在過去數小時內持續重啟：
- 每 20-30 秒啟動新任務
- 任務快速達到穩定狀態後又重新啟動
- 表明容器啟動後很快就因記憶體不足而崩潰

## 任務詳細狀態

### 當前任務 (8e179a77f4484ba4b3e5381eff664168)
- **最後狀態**: DEPROVISIONING
- **期望狀態**: STOPPED
- **停止原因**: Essential container in task exited
- **停止代碼**: EssentialContainerExited
- **CPU**: 256 單位
- **記憶體**: 512 MB
- **架構**: arm64

## 任務定義分析

### 資源配置
- **CPU**: 256 單位
- **記憶體**: 512 MB ⚠️ (可能不足)
- **網路模式**: awsvpc
- **日誌**: 配置到 CloudWatch Logs (claude-code-log-group)

### 容器映像
- **映像名稱**: ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v2
- **名稱暗示**: "high-memory-server" 但實際分配記憶體很少

## 建議解決方案

### 1. 立即解決方案
增加任務定義中的記憶體配置：
```bash
# 建議將記憶體從 512 MB 增加到至少 1024 MB 或 2048 MB
aws ecs register-task-definition \
  --family claude-code-task-def \
  --memory 1024 \  # 或 2048
  --region ap-east-2 \
  --profile neil
```

### 2. 監控和優化
- 檢查 CloudWatch Logs 以瞭解應用程式實際記憶體使用情況
- 考慮使用 CloudWatch Container Insights 監控資源使用率
- 評估是否需要調整 CPU 資源

### 3. 容器實例檢查
確認容器實例是否有足夠的記憶體來支援增加的配置要求

## 總結

**狀態**: 🔴 嚴重問題
**主要問題**: 記憶體配置不足導致容器持續崩潰重啟
**影響**: 服務無法正常運行，持續的重啟循環浪費資源
**優先級**: 高 - 需要立即處理

容器映像名稱包含 "high-memory-server" 但實際配置僅 512 MB，這表明存在配置和需求之間的不匹配。建議立即增加記憶體配置以解決此問題。