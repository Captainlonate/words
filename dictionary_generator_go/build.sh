#!/bin/zsh

mkdir -p ./build

# CMD All
ALL_SRC_GO="./cmd/cmdAll/cmdAll.go"
ALL_OSX_EXE="./build/goWords_osx_arm64"
ALL_WIN_EXE="./build/goWords_win_amd64.exe"

rm -f $ALL_OSX_EXE
rm -f $ALL_WIN_EXE

GOOS=darwin GOARCH=arm64 go build -ldflags "-w" -o $ALL_OSX_EXE $ALL_SRC_GO
GOOS=windows GOARCH=amd64 go build -ldflags "-w" -o $ALL_WIN_EXE $ALL_SRC_GO

du -sh ./build/*