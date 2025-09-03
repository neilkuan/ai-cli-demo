## Start chat
> 🚨🚨🚨 `--trust-all-tools` only for demo use 🚨🚨🚨
```
cd amazon-q/ops-chat
q chat --trust-all-tools
```

### Prompt 1.
```
查看 ECS amazon-q-cluster region ap-east-2, ECS Service 跟 task 以及 event 狀態如何？ aws profile 使用 neil (思考過程跟，使用的 tools，分析結果記錄在 RECORD.ecs.md）
```
### Prompt 2.
```
cd amazon-q/ops-code
q chat --trust-all-tools
```
```
讀取../ops-chat/RECORD.ecs.md 修復遇到的問題，當下資料夾為部署剛剛 ECS Cluster 的 CDK code， aws profile 使用 neil，並將修改過程記錄在 RECORD.ecs.fix.md
```

### Invoke Lambda Function
```bash
aws lambda invoke --function-name amazon-q-lambda --payload '{}' response.json --region ap-east-2 && cat response.json | jq
```
### Prompt 3.
```
cd amazon-q/ops-chat
q chat --trust-all-tools
```
```
查看 Lambda Function amazon-q-lambda 最近幾次的執行狀態如何？ aws profile 使用 neil region ap-east-2（思考過程跟，使用的 tools，分析結果記錄在 RECORD.lambda.md）
```

### Prompt 4.
```
cd amazon-q/ops-code
q chat --trust-all-tools
```
```
讀取../ops-chat/RECORD.lambda.md 修復遇到的問題，當下資料夾為部署剛剛 Lambda Function 的 CDK code ， aws profile 使用 neil，並將修改過程記錄在 RECORD.lambda.fix.md。
```


### Prompt 5.
```
根據  RECORD.lambda.fix.md 以及 RECORD.ecs.fix.md，原因過程結果發一個 PR 到 main branch 使用 github mcp。
```