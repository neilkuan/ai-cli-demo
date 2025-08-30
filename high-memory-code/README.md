# High Memory Server

This Go server allocates a large amount of memory at regular intervals to simulate high memory usage. By default, it allocates 600 MiB every 5 seconds, but you can adjust the allocation size using the `MEMORY_SET` environment variable.

- The server exposes a `/status` endpoint to report the current memory usage.
- On startup, it checks the container's memory limit and warns if the allocation size exceeds the available memory.
- All logs and messages are in English; comments in the code are in Chinese.

## Build and Run
```bash
docker build -t high-memory-server .
docker run --rm -p 8080:8080 high-memory-server
```

## Custom Memory Allocation
To change the allocated memory size (in MiB):
```bash
docker run --rm -p 8080:8080 -e MEMORY_SET=300 high-memory-server
```

## Only use
```bash
docker pull ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v1

docker run -p 8080:8080 --memory 250Mib -e MEMORY_SET=300 ghcr.io/neilkuan/ai-cli-demo:high-memory-server-v1
```