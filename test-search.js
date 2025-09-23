import { ObsidianAPIClient } from './build/client.js';

// 创建客户端实例（使用环境变量或默认值）
const config = {
  apiKey: process.env.OBSIDIAN_API_KEY || 'your-api-key-here',
  host: process.env.OBSIDIAN_HOST || '127.0.0.1',
  port: parseInt(process.env.OBSIDIAN_PORT || '27124'),
  secure: process.env.OBSIDIAN_SECURE !== 'false',
};

console.log('配置信息:', config);

const client = new ObsidianAPIClient(config);

async function testSearchSimple() {
  try {
    console.log('\n=== 测试 simple_search 功能 ===');
    
    // 测试一个简单的搜索查询
    const query = 'test';
    console.log(`搜索查询: "${query}"`);
    
    const results = await client.searchSimple(query, 50);
    console.log('搜索结果:', JSON.stringify(results, null, 2));
    
    if (results && results.length > 0) {
      console.log(`✅ 搜索成功！找到 ${results.length} 个结果`);
    } else {
      console.log('⚠️  搜索完成，但未找到匹配的结果（可能是正常的，取决于您的笔记内容）');
    }
    
  } catch (error) {
    console.error('❌ 搜索失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

async function testServerConnection() {
  try {
    console.log('\n=== 测试服务器连接 ===');
    const info = await client.getServerInfo();
    console.log('服务器信息:', JSON.stringify(info, null, 2));
    return true;
  } catch (error) {
    console.error('❌ 无法连接到 Obsidian 服务器:', error.message);
    console.error('请确保：');
    console.error('1. Obsidian 正在运行');
    console.error('2. Local REST API 插件已启用');
    console.error('3. API 密钥正确');
    console.error('4. 端口和主机配置正确');
    return false;
  }
}

async function main() {
  console.log('🔍 测试 Obsidian MCP 服务器的搜索功能');
  
  const isConnected = await testServerConnection();
  
  if (isConnected) {
    await testSearchSimple();
  }
}

main().catch(console.error);
