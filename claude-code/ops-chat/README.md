## Start chat
> 🚨🚨🚨 `--allowedTools * --dangerously-skip-permissions` only for demo use 🚨🚨🚨
```
cd claude-code/ops-chat
claude --allowedTools * --dangerously-skip-permissions
```


### Prompt 1.
```
查看 ECS claude-code-cluster region ap-east-2, ECS Service 跟 task 以及 event 狀態如何？ aws profile 使用 neil (思考過程跟，使用的 tools，分析結果記錄在 RECORD.ecs.md）
```

### Prompt 2.
```
cd claude-code/ops-code
claude --allowedTools * --dangerously-skip-permissions
```

```
根據 ../ops-chat/RECORD.ecs.md ，修復遇到的問題，當下資料夾為部署剛剛 ECS Cluster 的 CDK code 。
```

### Invoke Lambda Function
```bash
aws lambda invoke --function-name claude-code-lambda --payload '{}' response.json --region ap-east-2 && cat response.json | jq
```

### Prompt 3.
```
cd claude-code/ops-chat
claude --allowedTools * --dangerously-skip-permissions
```
```
查看 Lambda Function claude-code-lambda 最近幾次的執行狀態如何？ aws profile 使用 neil region ap-east-2 (思考過程跟，使用的 tools，分析結果記錄在 RECORD.lambda.md）
```

### Prompt 4.
```
cd claude-code/ops-code
claude --allowedTools * --dangerously-skip-permissions
```
```
根據 ../ops-chat/RECORD.lambda.md，修復剛剛的問題，當下資料夾為部署剛剛 Lambda Function 的 CDK code ，如果要部署請告訴我。
```
