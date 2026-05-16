#!/bin/bash

SESSION="dev"
PROJECT_DIR=$(pwd)

# 既存セッションを削除
tmux kill-session -t $SESSION 2>/dev/null

# セッション作成
tmux new-session -d -s $SESSION -x 400 -y 50

# 4ペイン作成
tmux split-window -h -t $SESSION:0.0
tmux split-window -v -t $SESSION:0.0
tmux split-window -v -t $SESSION:0.1

# 均等レイアウト適用
tmux select-layout -t $SESSION:0 tiled

# 各ペインをプロジェクトディレクトリに移動
for i in 0 1 2 3; do
  tmux send-keys -t $SESSION:0.$i "cd $PROJECT_DIR" Enter
done

# opencode を各ペインで起動
for i in 0 1 2 3; do
  tmux send-keys -t $SESSION:0.$i "opencode" Enter
done

# opencode の起動を待つ.(必要に応じて調整)
sleep 10

# 各エージェントに自分のロールを認識させる
tmux send-keys -t $SESSION:0.0 "You are the ARCHITECT. Read .agents/architect.md and AGENTS.md carefully. Understand your role and wait for instructions." Enter
sleep 1
tmux send-keys -t $SESSION:0.1 "You are the IMPLEMENTER. Read .agents/implementer.md and AGENTS.md carefully. Understand your role and wait for instructions." Enter
sleep 1
tmux send-keys -t $SESSION:0.2 "You are the TESTER. Read .agents/tester.md and AGENTS.md carefully. Understand your role and wait for instructions." Enter
sleep 1
tmux send-keys -t $SESSION:0.3 "You are the REVIEWER. Read .agents/reviewer.md and AGENTS.md carefully. Understand your role and wait for instructions." Enter

# セッションにアタッチ
tmux attach-session -t $SESSION