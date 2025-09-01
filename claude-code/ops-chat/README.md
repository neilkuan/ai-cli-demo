## Start chat
> 🚨🚨🚨 `--allowedTools * --dangerously-skip-permissions` only for demo use 🚨🚨🚨
```
claude --allowedTools * --dangerously-skip-permissions
```


### Prompt 1.
```
查看 ECS claude-code-cluster region ap-east-2, ECS Service 跟 task 以及 event 狀態如何？ aws profile 使用 neil
```

### 
```
! pwd
/save ${{PATH_TO_SAVE_CHAT}}/chat.json -f
```


### Prompt 2.
```
claude --allowedTools * --continue
修復剛剛的問題，當下資料夾為部署剛剛 ECS Cluster 的 CDK code 。
```

### Invoke Lambda Function
```bash
aws lambda invoke --function-name claude-code-lambda --payload '{}' response.json --region ap-east-2 && cat response.json | jq
```

```
claude --allowedTools * --dangerously-skip-permissions
```

### Prompt 3.
```
查看 Lambda Function claude-code-lambda 最近幾次的執行狀態如何？ aws profile 使用 neil region ap-east-2
```

### Prompt 4.
```
claude --allowedTools * --continue --dangerously-skip-permissions
修復剛剛的問題，當下資料夾為部署剛剛 Lambda Function 的 CDK code ，如果要部署請告訴我。
```
