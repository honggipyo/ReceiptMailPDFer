#!/usr/bin/env bash
# wait-for-it.sh

set -e

host="$1"
port="$2"

if [[ -z "$host" || -z "$port" ]]; then
  echo "Usage: $0 host port -- command_to_run"
  exit 1
fi

shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 2
done

echo "$host:$port is available. Starting app..."
exec $cmd
