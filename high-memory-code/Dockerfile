# build stage
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o high-memory-server main.go

# run stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/high-memory-server .
EXPOSE 8080
CMD ["./high-memory-server"]
