import { ObsidianAPIClient } from './build/client.js';

// 使用您提供的真实配置
const config = {
  apiKey: 'db5861ccaaa843105b163467034e8b0c92d22ea08ee68f9e47ae69800d961209',
  host: '127.0.0.1',
  port: 27124,
  secure: true, // 使用HTTPS
};

console.log('配置信息:');
console.log(`- 主机: ${config.host}:${config.port}`);
console.log(`- API密钥: ${config.apiKey.substring(0, 8)}...`);
console.log(`- HTTPS: ${config.secure}`);

const client = new ObsidianAPIClient(config);

async function testServerConnection() {
  try {
    console.log('\n=== 测试服务器连接 ===');
    const info = await client.getServerInfo();
    console.log('✅ 服务器连接成功！');
    console.log('服务器信息:', JSON.stringify(info, null, 2));
    return true;
  } catch (error) {
    console.error('❌ 无法连接到 Obsidian 服务器:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

async function testSearchSimple() {
  try {
    console.log('\n=== 测试 simple_search 功能 ===');
    
    // 测试几个不同的搜索查询
    const queries = ['test', '笔记', 'note', 'TODO'];
    
    for (const query of queries) {
      console.log(`\n🔍 搜索查询: "${query}"`);
      
      const results = await client.searchSimple(query, 50);
      console.log(`响应数据类型: ${typeof results}`);
      console.log(`响应数据: ${JSON.stringify(results, null, 2)}`);
      
      if (Array.isArray(results)) {
        if (results.length > 0) {
          console.log(`✅ 搜索成功！找到 ${results.length} 个结果`);
          
          // 显示前几个结果的详情
          results.slice(0, 2).forEach((result, index) => {
            console.log(`\n结果 ${index + 1}:`);
            console.log(`- 文件: ${result.filename || 'N/A'}`);
            console.log(`- 评分: ${result.score || 'N/A'}`);
            if (result.matches && result.matches.length > 0) {
              console.log(`- 匹配数: ${result.matches.length}`);
              console.log(`- 示例匹配: "${result.matches[0].context?.substring(0, 100) || 'N/A'}..."`);
            }
          });
        } else {
          console.log(`ℹ️  搜索完成，未找到包含 "${query}" 的文件`);
        }
      } else {
        console.log(`⚠️  响应格式异常，期望数组但得到: ${typeof results}`);
      }
    }
    
  } catch (error) {
    console.error('❌ 搜索失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

async function testFileOperations() {
  try {
    console.log('\n=== 测试文件操作 ===');
    
    // 测试获取文件列表
    console.log('📁 获取根目录文件列表...');
    const files = await client.listDirectory('');
    console.log(`✅ 找到 ${files.length} 个文件/目录:`);
    files.slice(0, 5).forEach(file => {
      console.log(`- ${file.name || file}`);
    });
    
    if (files.length > 5) {
      console.log(`... 还有 ${files.length - 5} 个文件`);
    }
    
  } catch (error) {
    console.error('❌ 文件操作失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

async function main() {
  console.log('🔍 测试 Obsidian MCP 服务器功能');
  console.log('==============================');
  
  const isConnected = await testServerConnection();
  
  if (isConnected) {
    await testSearchSimple();
    await testFileOperations();
    console.log('\n✅ 测试完成！');
  } else {
    console.log('\n❌ 由于连接失败，跳过功能测试');
  }
}

main().catch(console.error);
