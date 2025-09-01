## Start chat
> 🚨🚨🚨 `--trust-all-tools` only for demo use 🚨🚨🚨
```
q chat --trust-all-tools
```

### Prompt 1.
```
查看 ECS amazon-q-cluster region ap-east-2, ECS Service 跟 task 以及 event 狀態如何？ aws profile 使用 neil
```

### Save Chat
```
! pwd
/save ${{PATH_TO_SAVE_CHAT}}/chat.json -f
```

### Load Chat
```
! pwd
/load ${{PATH_TO_SAVE_CHAT}}/chat.json
```

### Prompt 2.
```
修復剛剛的問題，當下資料夾為部署剛剛 ECS Cluster 的 CDK code， aws profile 使用 neil，如果要部署請告訴我
```

### Invoke Lambda Function
```bash
aws lambda invoke --function-name amazon-q-lambda --payload '{}' response.json --region ap-east-2 && cat response.json | jq
```


```
q chat --trust-all-tools
```

### Prompt 3.
```
查看 Lambda Function amazon-q-lambda 最近幾次的執行狀態如何？ aws profile 使用 neil region ap-east-2
```

### Save Chat
```
! pwd
/save ${{PATH_TO_SAVE_CHAT}}/chat.json -f
```

### Load Chat
```
! pwd
/load ${{PATH_TO_SAVE_CHAT}}/chat.json
```

### Prompt 4.
```
q chat --trust-all-tools --resume
修復剛剛的問題，當下資料夾為部署剛剛 Lambda Function 的 CDK code ， aws profile 使用 neil，如果要部署請告訴我.
```
