# ECS Task OutOfMemoryError Fix

## Problem

The ECS task was failing with an `OutOfMemoryError`. The container `AppContainer` was killed because it exceeded its memory limit.

## Analysis

I analyzed the `ops-chat/RECORD.ecs.md` file and found the following information in the "ECS Task Details" section:
- The container `AppContainer` was stopped.
- The `reason` for stopping is `OutOfMemoryError: Container killed due to memory usage`.
- The `exitCode` is `137`.
- The task `memory` is `512`.

This indicated that the container was running out of memory.

I then examined the CDK code in `ops-code/lib/gemini-cli-stack.ts` and found that the `memoryLimitMiB` was set to `512`.

## Solution

I increased the `memoryLimitMiB` from `512` to `1024` in `ops-code/lib/gemini-cli-stack.ts`.

This change will allocate more memory to the ECS task and should resolve the `OutOfMemoryError`.

## Deployment

To apply the fix, I will run the following command from the `ops-code` directory:

```bash
cdk deploy --profile neil
```
