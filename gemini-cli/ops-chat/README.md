## Start chat
> 🚨🚨🚨 `--yolo` only for demo use 🚨🚨🚨
```
gemini --yolo --checkpointing
```

### Prompt 1.
```
查看 ECS gemini-cli-cluster region ap-east-2, ECS Service 跟 task 以及 event 狀態如何？ aws profile 使用 neil
```


### Save Chat
```
/chat save ecs
```

### Load Chat
```
/chat resume ecs
```

### Prompt 2.
```
修復剛剛的問題，當下資料夾為部署剛剛 ECS Cluster 的 CDK code 。
```

### Invoke Lambda Function
```bash
aws lambda invoke --function-name gemini-cli-lambda --payload '{}' response.json --region ap-east-2 && cat response.json | jq
```

### Prompt 3.
```
查看 Lambda Function gemini-cli-lambda 最近幾次的執行狀態如何？ aws profile 使用 neil region ap-east-2
```

### Save Chat
```
/chat save lambda
```

### Load Chat
```
/chat resume lambda
```

### Prompt 4.
```
修復剛剛的問題，當下資料夾為部署剛剛 Lambda Function 的 CDK code ，如果要部署請告訴我。
```
