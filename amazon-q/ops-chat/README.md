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
q chat --trust-all-tools --resume
```
```
修復剛剛的問題，當下資料夾為部署剛剛 ECS Cluster 的 CDK code， aws profile 使用 neil，如果要部署請告訴我
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
查看 Lambda Function amazon-q-lambda 最近幾次的執行狀態如何？ aws profile 使用 neil region ap-east-2（思考過程跟，使用的 tools，分析結果記錄在 RECORD.md）
```

### Prompt 4.
```
cd amazon-q/ops-code
q chat --trust-all-tools --resume
```
```
修復剛剛的問題，當下資料夾為部署剛剛 Lambda Function 的 CDK code ， aws profile 使用 neil，如果要部署請告訴我.
```
