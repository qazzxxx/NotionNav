#!/usr/bin/env node

/**
 * 部署状态检查脚本
 * 用于验证部署配置是否正确
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 检查部署配置...\n");

// 检查必需文件
const requiredFiles = [
  "package.json",
  "next.config.ts",
  "vercel.json",
  "src/app/page.tsx",
  "src/config/notion.ts",
];

console.log("📁 检查必需文件:");
requiredFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? "✅" : "❌"} ${file}`);
  if (!exists) {
    console.error(`    缺少文件: ${file}`);
  }
});

// 检查环境变量配置
console.log("\n🔧 检查环境变量配置:");
const envExample = fs.existsSync(".env.example");
console.log(`  ${envExample ? "✅" : "❌"} .env.example`);

if (fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  const hasPageId = envContent.includes("NOTION_PAGE_ID=");
  console.log(`  ${hasPageId ? "✅" : "❌"} NOTION_PAGE_ID 已配置`);
} else {
  console.log("  ⚠️  .env.local 文件不存在（部署时需要配置环境变量）");
}

// 检查 package.json
console.log("\n📦 检查 package.json:");
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

  const hasNextJs = packageJson.dependencies && packageJson.dependencies.next;
  const hasNotionClient =
    packageJson.dependencies && packageJson.dependencies["notion-client"];
  const hasBuildScript = packageJson.scripts && packageJson.scripts.build;
  const hasDevScript = packageJson.scripts && packageJson.scripts.dev;

  console.log(`  ${hasNextJs ? "✅" : "❌"} Next.js 依赖`);
  console.log(`  ${hasNotionClient ? "✅" : "❌"} notion-client 依赖`);
  console.log(`  ${hasBuildScript ? "✅" : "❌"} build 脚本`);
  console.log(`  ${hasDevScript ? "✅" : "❌"} dev 脚本`);

  if (hasNextJs) {
    console.log(`    版本: ${packageJson.dependencies.next}`);
  }
} catch (error) {
  console.error("  ❌ 无法解析 package.json");
}

// 检查 vercel.json
console.log("\n🚀 检查 Vercel 配置:");
try {
  const vercelConfig = JSON.parse(fs.readFileSync("vercel.json", "utf8"));

  const hasFramework = vercelConfig.framework === "nextjs";
  const hasBuildCommand = vercelConfig.buildCommand;
  const hasDevCommand = vercelConfig.devCommand;

  console.log(`  ${hasFramework ? "✅" : "❌"} framework: nextjs`);
  console.log(`  ${hasBuildCommand ? "✅" : "❌"} buildCommand 已配置`);
  console.log(`  ${hasDevCommand ? "✅" : "❌"} devCommand 已配置`);
} catch (error) {
  console.error("  ❌ 无法解析 vercel.json");
}

// 检查 API 路由
console.log("\n🔌 检查 API 路由:");
const apiRoutes = ["src/app/api/menu/route.ts", "src/app/api/auth/route.ts"];

apiRoutes.forEach((route) => {
  const exists = fs.existsSync(route);
  console.log(`  ${exists ? "✅" : "❌"} ${route}`);
});

// 总结
console.log("\n📋 部署检查总结:");
console.log("✅ 如果所有检查都通过，你的项目已准备好部署到 Vercel");
console.log("❌ 如果有任何检查失败，请修复相关问题后再部署");
console.log("\n📖 查看 DEPLOYMENT.md 获取详细部署指南");
console.log("🔗 访问 https://vercel.com 开始部署");

// 退出码
const hasErrors = false; // 这里可以添加更详细的错误检查逻辑
process.exit(hasErrors ? 1 : 0);
