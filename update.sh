#!/bin/bash

# Stop all existing bot processes
echo "Stopping all existing bot processes..."
pkill -9 -f "python3 start.py"
pkill -9 -f "run.sh"
sleep 2

# Navigate to the bot directory (assuming typical layout)
# cd ~/bot_tokocypto

# Pull latest changes from GitHub
echo "Pulling latest changes from GitHub..."
git pull origin master

# Make sure run.sh is executable
chmod +x run.sh

# Start the bot in background
echo "Starting the bot..."
nohup ./run.sh > /dev/null 2>&1 &

echo "Bot updated and started successfully!"
echo "Check logs with: tail -f logs/Bot/$(date +%Y_%m_%d)/Bot.log"
