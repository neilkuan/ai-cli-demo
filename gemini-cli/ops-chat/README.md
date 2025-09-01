## Start chat
> 🚨🚨🚨 `--yolo` only for demo use 🚨🚨🚨
```
cd gemini-cli/ops-chat
gemini --yolo --checkpointing
```

### Prompt 1.
```
查看 ECS gemini-cli-cluster region ap-east-2, ECS Service 跟 task 以及 event 狀態如何？ aws profile 使用 neil (思考過程跟，使用的 tools，分析結果記錄在 RECORD.md）

/chat save ecs
```

### Prompt 2.
```
cd gemini-cli/ops-code
gemini --yolo --checkpointing

/chat resume ecs
```
```
修復剛剛的問題，當下資料夾為部署剛剛 ECS Cluster 的 CDK code 。
```

### Invoke Lambda Function
```bash
aws lambda invoke --function-name gemini-cli-lambda --payload '{}' response.json --region ap-east-2 && cat response.json | jq
```


### Prompt 3.
```
cd gemini-cli/ops-chat
gemini --yolo --checkpointing
```
```
查看 Lambda Function gemini-cli-lambda 最近幾次的執行狀態如何？ aws profile 使用 neil region ap-east-2 (思考過程跟，使用的 tools，分析結果記錄在 RECORD.md）

/chat save lambda
```

### Prompt 4.
```
cd gemini-cli/ops-code
gemini --yolo --checkpointing

/chat resume lambda
```
```
修復剛剛的問題，當下資料夾為部署剛剛 Lambda Function 的 CDK code ，如果要部署請告訴我。
```
