# Obsidian MCP Server

一个基于Model Context Protocol (MCP)的Obsidian Local REST API服务器，允许AI助手与你的Obsidian笔记进行交互。

## 功能特性

- 📖 读取和写入Obsidian笔记
- 📁 浏览和管理文件夹结构
- 🔍 搜索笔记内容
- 📅 管理周期性笔记（日记、周记等）
- ⚡ 执行Obsidian命令
- 🔐 支持安全的HTTPS连接
- 🎯 支持所有Obsidian Local REST API功能

## 前置要求

1. **Obsidian** - 安装最新版本的Obsidian
2. **Local REST API插件** - 在Obsidian中安装并启用"Local REST API"插件
3. **Node.js** - 版本 18+ 

## 安装

### 方式1: 通过npx直接使用（推荐）

```bash
npx @cupkappu/mcp-obsidian-server
```

### 方式2: 全局安装

```bash
npm install -g @cupkappu/mcp-obsidian-server
mcp-obsidian-server
```

### 方式3: 从源码安装

```bash
# 克隆项目
git clone https://github.com/cupkappu/mcp-obsidian-server.git
cd mcp-obsidian-server

# 安装依赖
npm install

# 构建项目
npm run build
```

## 配置

在使用MCP服务器之前，你需要：

### 1. 配置Obsidian Local REST API插件

1. 在Obsidian中打开设置
2. 转到"插件"选项卡
3. 找到"Local REST API"插件并点击其设置
4. 记录以下信息：
   - **API Key** - 插件生成的API密钥
   - **Host** - 通常是 `127.0.0.1`
   - **Port** - 默认HTTPS端口是 `27124`，HTTP端口是 `27123`
   - **SSL** - 是否启用HTTPS（推荐）

### 2. 设置环境变量

创建一个 `.env` 文件或设置以下环境变量：

```bash
# 必需 - 你的Obsidian API密钥
export OBSIDIAN_API_KEY="your-api-key-here"

# 可选 - 服务器配置（如果使用默认值则可省略）
export OBSIDIAN_HOST="127.0.0.1"           # 默认: 127.0.0.1
export OBSIDIAN_PORT="27124"               # 默认: 27124 (HTTPS) 或 27123 (HTTP)
export OBSIDIAN_SECURE="true"              # 默认: true (使用HTTPS)
```

## 使用方法

### 1. 直接运行

```bash
# 设置环境变量并运行
OBSIDIAN_API_KEY="your-api-key" npm start
```

### 2. 在MCP客户端中使用

将以下配置添加到你的MCP客户端配置文件中：

#### Claude Desktop配置示例

编辑 `~/Library/Application Support/Claude/claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["@cupkappu/mcp-obsidian-server"],
      "env": {
        "OBSIDIAN_API_KEY": "your-api-key-here",
        "OBSIDIAN_HOST": "127.0.0.1",
        "OBSIDIAN_PORT": "27124",
        "OBSIDIAN_SECURE": "true"
      }
    }
  }
}
```

或者如果你全局安装了：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "mcp-obsidian-server",
      "env": {
        "OBSIDIAN_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Continue.dev配置示例

在你的 `continue.json` 配置文件中：

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "npx",
      "args": ["@cupkappu/mcp-obsidian-server"],
      "env": {
        "OBSIDIAN_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## 可用工具

MCP服务器提供以下工具：

### 系统工具
- `get_server_info` - 获取服务器信息和认证状态

### 活动文件操作
- `get_active_file` - 获取当前活动文件内容
- `update_active_file` - 更新当前活动文件
- `append_to_active_file` - 向当前活动文件追加内容

### 文件操作
- `get_file` - 获取指定文件内容
- `create_or_update_file` - 创建或更新文件
- `append_to_file` - 向文件追加内容
- `delete_file` - 删除文件

### 目录操作
- `list_directory` - 列出目录内容

### 搜索功能
- `search_simple` - 简单文本搜索

### 命令操作
- `get_commands` - 获取可用命令列表
- `execute_command` - 执行Obsidian命令

### 文件管理
- `open_file` - 在Obsidian中打开文件

### 周期性笔记
- `get_periodic_note` - 获取周期性笔记
- `append_to_periodic_note` - 向周期性笔记追加内容

## 使用示例

一旦配置完成，你就可以在AI助手中使用类似以下的指令：

```
"请帮我查看今天的日记内容"
"在我的学习笔记中搜索'机器学习'"
"创建一个新的项目笔记，标题为'新项目计划'"
"列出我的笔记库根目录下的所有文件"
```

## 故障排除

### 常见问题

1. **连接错误**
   - 确保Obsidian正在运行且Local REST API插件已启用
   - 检查API密钥是否正确
   - 验证主机和端口设置

2. **证书错误（HTTPS模式）**
   - Local REST API插件使用自签名证书
   - 服务器会自动忽略证书验证错误
   - 如果仍有问题，可以尝试使用HTTP模式（设置 `OBSIDIAN_SECURE=false`）

3. **权限错误**
   - 确保API密钥有效且未过期
   - 检查Obsidian中的插件设置

### 调试

启用详细日志：

```bash
DEBUG=1 OBSIDIAN_API_KEY="your-api-key" npm start
```

## 开发

### 开发模式运行

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 项目结构

```
src/
  ├── index.ts      # MCP服务器主文件
  ├── client.ts     # Obsidian API客户端
  └── types.ts      # TypeScript类型定义
build/              # 编译后的JavaScript文件
```

## 许可证

MIT License

## 贡献

欢迎提交Pull Request和Issue！

## 支持

如果你遇到问题：

1. 检查Obsidian Local REST API插件的设置
2. 验证环境变量配置
3. 查看服务器日志输出
4. 提交Issue到GitHub仓库

---

**注意**: 这个MCP服务器需要Obsidian Local REST API插件正常运行。请确保插件已正确安装并配置。
