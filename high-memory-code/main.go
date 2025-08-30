package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

var (
	memorySlices [][]byte
	mu           sync.Mutex
	memorySetMiB int64 = 600 // 預設 600 MiB
)

// 取得 container 記憶體限制（支援 cgroup v1/v2）
func getContainerMemoryLimitMiB() (float64, string) {
	// cgroup v2
	if data, err := os.ReadFile("/sys/fs/cgroup/memory.max"); err == nil {
		val := strings.TrimSpace(string(data))
		if val != "max" {
			memLimit, _ := strconv.ParseInt(val, 10, 64)
			return float64(memLimit) / 1024 / 1024, "cgroup v2"
		}
	}
	// cgroup v1
	if data, err := os.ReadFile("/sys/fs/cgroup/memory/memory.limit_in_bytes"); err == nil {
		memLimit, _ := strconv.ParseInt(strings.TrimSpace(string(data)), 10, 64)
		return float64(memLimit) / 1024 / 1024, "cgroup v1"
	}
	return -1, "not found"
}

// 啟動時顯示 container 記憶體限制，並檢查 MEMORY_SET 是否超過
func printContainerResourcesAndCheck(memorySetMiB int64) int64 {
	memLimitMiB, cgType := getContainerMemoryLimitMiB()
	if memLimitMiB > 0 {
		fmt.Printf("Container memory limit (%s): %.2f MiB\n", cgType, memLimitMiB)
		if int64(memLimitMiB) < memorySetMiB {
			fmt.Printf("[WARNING] MEMORY_SET=%d MiB exceeds container memory limit %.2f MiB, possible OOM! (Out Of Memory)\n", memorySetMiB, memLimitMiB)
		}
		return int64(memLimitMiB)
	} else {
		fmt.Println("Cannot detect container memory limit (cgroup v1/v2 not found)")
	}
	return -1
}

// 取得 MEMORY_SET 環境變數
func getMemorySetFromEnv() int64 {
	memStr := os.Getenv("MEMORY_SET")
	if memStr == "" {
		return 600
	}
	memVal, err := strconv.ParseInt(memStr, 10, 64)
	if err != nil || memVal <= 0 {
		fmt.Printf("Invalid MEMORY_SET env value: %s, fallback to 600 MiB\n", memStr)
		return 600
	}
	return memVal
}

func main() {
	memorySetMiB = getMemorySetFromEnv()
	printContainerResourcesAndCheck(memorySetMiB)

	go func() {
		defer func() {
			if r := recover(); r != nil {
				if errStr, ok := r.(string); ok && (errStr == "runtime: out of memory" || errStr == "out of memory") {
					fmt.Println("OOM: Out Of Memory detected!")
				} else {
					fmt.Printf("panic: %v\n", r)
				}
			}
		}()
		for {

			for i := 0; i < 11; i++ {
				time.Sleep(1 * time.Second)
				fmt.Printf("%d...", i)
			}

			mu.Lock()
			// 分配 memorySetMiB MiB 記憶體
			mem := make([]byte, memorySetMiB*1024*1024)
			for i := range mem {
				mem[i] = 1 // 實際寫入，確保分配到物理記憶體
			}
			memorySlices = append(memorySlices, mem)
			fmt.Printf("Allocated %d MiB, total allocations: %d\n", memorySetMiB, len(memorySlices))
			mu.Unlock()
			time.Sleep(5 * time.Second)
		}
	}()

	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		fmt.Fprintf(w, "Allocated %d x %d MiB = %.2f GiB\n", len(memorySlices), memorySetMiB, float64(len(memorySlices))*float64(memorySetMiB)/1024)
		mu.Unlock()
	})

	fmt.Println("Server started on :8080")
	http.ListenAndServe(":8080", nil)
}
