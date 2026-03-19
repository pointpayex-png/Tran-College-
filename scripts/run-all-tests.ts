import { execSync } from "child_process"
import { generateExportReport } from "./verify-exports"
import { deployAndTest } from "./deploy-test"

async function runAllTests() {
  console.log("🚀 Starting comprehensive test suite...\n")

  let allPassed = true

  try {
    // 1. Verify exports
    console.log("📋 Step 1: Verifying exports...")
    const exportsValid = generateExportReport()
    if (!exportsValid) {
      console.log("❌ Export verification failed!")
      allPassed = false
    } else {
      console.log("✅ Export verification passed!")
    }

    console.log("\n" + "=".repeat(50) + "\n")

    // 2. Run unit tests
    console.log("🧪 Step 2: Running unit tests...")
    try {
      execSync("npm test -- --coverage --watchAll=false", { stdio: "inherit" })
      console.log("✅ Unit tests passed!")
    } catch (error) {
      console.log("❌ Unit tests failed!")
      allPassed = false
    }

    console.log("\n" + "=".repeat(50) + "\n")

    // 3. Run integration tests
    console.log("🔗 Step 3: Running integration tests...")
    try {
      execSync("npm run test:integration", { stdio: "inherit" })
      console.log("✅ Integration tests passed!")
    } catch (error) {
      console.log("❌ Integration tests failed!")
      allPassed = false
    }

    console.log("\n" + "=".repeat(50) + "\n")

    // 4. Build and deploy test
    console.log("🏗️  Step 4: Build and deployment test...")
    const deploymentPassed = await deployAndTest()
    if (!deploymentPassed) {
      console.log("❌ Deployment tests failed!")
      allPassed = false
    } else {
      console.log("✅ Deployment tests passed!")
    }

    console.log("\n" + "=".repeat(50) + "\n")

    // 5. Final report
    if (allPassed) {
      console.log("🎉 ALL TESTS PASSED! 🎉")
      console.log("✅ Export verification: PASSED")
      console.log("✅ Unit tests: PASSED")
      console.log("✅ Integration tests: PASSED")
      console.log("✅ Deployment tests: PASSED")
      console.log("\n🚀 Your application is ready for production!")
    } else {
      console.log("❌ SOME TESTS FAILED!")
      console.log("Please check the logs above and fix the issues.")
    }

    return allPassed
  } catch (error) {
    console.error("💥 Test suite failed with error:", error)
    return false
  }
}

// Package.json scripts to add
const packageJsonScripts = {
  test: "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:integration": "jest --testPathPattern=integration",
  "verify-exports": "ts-node scripts/verify-exports.ts",
  "deploy-test": "ts-node scripts/deploy-test.ts",
  "test:all": "ts-node scripts/run-all-tests.ts",
}

console.log("\n📦 Add these scripts to your package.json:")
console.log(JSON.stringify(packageJsonScripts, null, 2))

// Run if called directly
if (require.main === module) {
  runAllTests().then((success) => {
    process.exit(success ? 0 : 1)
  })
}

export { runAllTests }
