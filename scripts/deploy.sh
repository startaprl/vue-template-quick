#!/bin/bash

# ==========================================
# 自动化部署脚本
# ==========================================

# 服务器配置
SERVER= '服务器地址' # "root@47.86.87.137"
REMOTE_PATH= '部署路径' # "/www/taotao/web/"
ZIP_NAME="dist.zip"
LOCAL_DIST="dist"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}>>> 开始部署流程...${NC}"

# 1. 检查本地 dist 目录
if [ ! -d "$LOCAL_DIST" ]; then
    echo -e "${RED}错误: 本地 $LOCAL_DIST 目录不存在！请先运行打包命令 (如 npm run build)${NC}"
    exit 1
fi

# 2. 压缩 dist 文件
echo -e "${GREEN}>>> 正在压缩 $LOCAL_DIST 文件夹...${NC}"
# 使用 -q 静默压缩，-r 递归压缩
zip -rq $ZIP_NAME $LOCAL_DIST

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 压缩失败，请确保已安装 zip 工具${NC}"
    exit 1
fi

# 3. 上传压缩包到服务器
echo -e "${GREEN}>>> 正在上传 $ZIP_NAME 到服务器 $REMOTE_PATH ...${NC}"
scp $ZIP_NAME $SERVER:$REMOTE_PATH

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 上传失败，请检查网络或 SSH 配置${NC}"
    rm $ZIP_NAME
    exit 1
fi

# 4. 远程解压并覆盖
echo -e "${GREEN}>>> 正在远程解压并清理...${NC}"
ssh $SERVER "cd $REMOTE_PATH && unzip -o $ZIP_NAME && rm $ZIP_NAME"

if [ $? -ne 0 ]; then
    echo -e "${RED}错误: 远程执行指令失败${NC}"
    rm $ZIP_NAME
    exit 1
fi

# 5. 清理本地临时文件
rm $ZIP_NAME

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}      部署成功！🎉🎉🎉          ${NC}"
echo -e "${GREEN}================================${NC}"
