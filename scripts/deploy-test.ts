import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

interface DeploymentTest {
  name: string
  url: string
  expectedStatus: number
  expectedContent?: string
}

const deploymentTests: DeploymentTest[] = [
  {
    name: "Homepage loads",
    url: "/",
    expectedStatus: 200,
    expectedContent: "Trans-Pay",
  },
  {
    name: "Payment page loads",
    url: "/payment",
    expectedStatus: 200,
    expectedContent: "Payment Center",
  },
  {
    name: "Auth page loads",
    url: "/auth",
    expectedStatus: 200,
    expectedContent: "Sign In",
  },
  {
    name: "Admin dashboard loads",
    url: "/admin-dashboard",
    expectedStatus: 200,
  },
  {
    name: "Payment API endpoint",
    url: "/api/payments/initiate",
    expectedStatus: 405, // Method not allowed for GET
  },
  {
    name: "Payment status API endpoint",
    url: "/api/payments/status",
    expectedStatus: 400, // Bad request without params
  },
]

async function runDeploymentTests(baseUrl: string) {
  console.log("🚀 Starting deployment tests...")
  console.log(`Base URL: ${baseUrl}`)

  const results = []

  for (const test of deploymentTests) {
    try {
      console.log(`\n🧪 Testing: ${test.name}`)

      const response = await fetch(`${baseUrl}${test.url}`)
      const content = await response.text()

      const statusMatch = response.status === test.expectedStatus
      const contentMatch = test.expectedContent ? content.includes(test.expectedContent) : true

      const passed = statusMatch && contentMatch

      results.push({
        ...test,
        passed,
        actualStatus: response.status,
        statusMatch,
        contentMatch,
      })

      console.log(`   Status: ${response.status} ${statusMatch ? "✅" : "❌"}`)
      if (test.expectedContent) {
        console.log(`   Content: ${contentMatch ? "✅" : "❌"}`)
      }
      console.log(`   Result: ${passed ? "✅ PASS" : "❌ FAIL"}`)
    } catch (error) {
      console.log(`   Error: ❌ ${error}`)
      results.push({
        ...test,
        passed: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Summary
  const passed = results.filter((r) => r.passed).length
  const total = results.length

  console.log(`\n📊 Test Summary:`)
  console.log(`   Passed: ${passed}/${total}`)
  console.log(`   Success Rate: ${((passed / total) * 100).toFixed(1)}%`)

  if (passed === total) {
    console.log(`\n🎉 All deployment tests passed!`)
    return true
  } else {
    console.log(`\n❌ Some tests failed. Check the logs above.`)
    return false
  }
}

async function deployAndTest() {
  try {
    console.log("🔨 Building application...")
    await execAsync("npm run build")
    console.log("✅ Build completed successfully")

    console.log("\n🚀 Starting application...")
    const server = exec("npm start")

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Run tests
    const testsPassed = await runDeploymentTests("http://localhost:3000")

    // Kill server
    server.kill()

    if (testsPassed) {
      console.log("\n🎉 Deployment and testing completed successfully!")
      process.exit(0)
    } else {
      console.log("\n❌ Deployment tests failed!")
      process.exit(1)
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  deployAndTest()
}

export { runDeploymentTests, deployAndTest }
