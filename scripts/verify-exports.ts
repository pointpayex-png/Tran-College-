import * as fs from "fs"
import * as path from "path"

interface ExportInfo {
  file: string
  namedExports: string[]
  defaultExport: boolean
  hasTypeExports: boolean
}

interface ExportIssue {
  file: string
  issue: string
  severity: "error" | "warning"
}

const COMPONENT_DIRECTORIES = ["components", "lib", "hooks", "app", "utils"]

const REQUIRED_EXPORTS = {
  "components/payment/payment-system.tsx": ["PaymentSystem"],
  "components/payment/payment-dashboard.tsx": ["PaymentDashboard"],
  "components/auth/complete-auth-system.tsx": ["CompleteAuthSystem"],
  "components/auth/auth-wrapper.tsx": ["AuthWrapper"],
  "components/dashboards/admin-dashboard.tsx": ["AdminDashboard"],
  "lib/auth-context.tsx": ["AuthProvider", "useAuth"],
  "hooks/use-auth.ts": ["useAuth"],
}

function extractExports(filePath: string): ExportInfo {
  const content = fs.readFileSync(filePath, "utf-8")

  // Find named exports
  const namedExportRegex = /export\s+(?:const|function|class|interface|type)\s+(\w+)/g
  const namedExportBraceRegex = /export\s*{\s*([^}]+)\s*}/g
  const defaultExportRegex = /export\s+default/
  const typeExportRegex = /export\s+(?:type|interface)/

  const namedExports: string[] = []
  let match

  // Extract from export statements
  while ((match = namedExportRegex.exec(content)) !== null) {
    namedExports.push(match[1])
  }

  // Extract from export { } statements
  while ((match = namedExportBraceRegex.exec(content)) !== null) {
    const exports = match[1].split(",").map((e) => e.trim().split(" as ")[0])
    namedExports.push(...exports)
  }

  return {
    file: filePath,
    namedExports: [...new Set(namedExports)], // Remove duplicates
    defaultExport: defaultExportRegex.test(content),
    hasTypeExports: typeExportRegex.test(content),
  }
}

function findTSXFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) return files

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory() && !item.startsWith(".") && item !== "node_modules") {
      files.push(...findTSXFiles(fullPath))
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      files.push(fullPath)
    }
  }

  return files
}

function verifyExports(): ExportIssue[] {
  const issues: ExportIssue[] = []
  const allFiles: string[] = []

  // Find all TypeScript/React files
  for (const dir of COMPONENT_DIRECTORIES) {
    allFiles.push(...findTSXFiles(dir))
  }

  console.log(`🔍 Analyzing ${allFiles.length} files for export issues...`)

  // Check each file
  for (const file of allFiles) {
    try {
      const exportInfo = extractExports(file)
      const relativePath = path.relative(process.cwd(), file)

      // Check required exports
      if (REQUIRED_EXPORTS[relativePath]) {
        const required = REQUIRED_EXPORTS[relativePath]
        const missing = required.filter((exp) => !exportInfo.namedExports.includes(exp))

        if (missing.length > 0) {
          issues.push({
            file: relativePath,
            issue: `Missing required exports: ${missing.join(", ")}`,
            severity: "error",
          })
        }
      }

      // Check for components without proper exports
      if (file.includes("components/") && file.endsWith(".tsx")) {
        const componentName = path
          .basename(file, ".tsx")
          .split("-")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("")

        if (!exportInfo.namedExports.includes(componentName) && !exportInfo.defaultExport) {
          issues.push({
            file: relativePath,
            issue: `Component should export ${componentName} as named export or default export`,
            severity: "warning",
          })
        }
      }

      // Check for hooks without proper exports
      if (file.includes("hooks/") && file.endsWith(".ts")) {
        const hookName = path.basename(file, ".ts")
        const expectedHookName = hookName.startsWith("use-")
          ? hookName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
          : hookName

        if (!exportInfo.namedExports.includes(expectedHookName)) {
          issues.push({
            file: relativePath,
            issue: `Hook should export ${expectedHookName} as named export`,
            severity: "error",
          })
        }
      }

      // Log file info
      console.log(`📄 ${relativePath}:`)
      console.log(`   Named exports: ${exportInfo.namedExports.join(", ") || "none"}`)
      console.log(`   Default export: ${exportInfo.defaultExport ? "✅" : "❌"}`)
      console.log(`   Type exports: ${exportInfo.hasTypeExports ? "✅" : "❌"}`)
    } catch (error) {
      issues.push({
        file: path.relative(process.cwd(), file),
        issue: `Failed to analyze file: ${error}`,
        severity: "error",
      })
    }
  }

  return issues
}

function generateExportReport() {
  console.log("🔍 Starting export verification...\n")

  const issues = verifyExports()

  // Group issues by severity
  const errors = issues.filter((i) => i.severity === "error")
  const warnings = issues.filter((i) => i.severity === "warning")

  console.log("\n📊 Export Verification Report:")
  console.log(
    `   Total files analyzed: ${findTSXFiles("components").length + findTSXFiles("lib").length + findTSXFiles("hooks").length}`,
  )
  console.log(`   Errors: ${errors.length}`)
  console.log(`   Warnings: ${warnings.length}`)

  if (errors.length > 0) {
    console.log("\n❌ ERRORS:")
    errors.forEach((error) => {
      console.log(`   ${error.file}: ${error.issue}`)
    })
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:")
    warnings.forEach((warning) => {
      console.log(`   ${warning.file}: ${warning.issue}`)
    })
  }

  if (issues.length === 0) {
    console.log("\n🎉 All exports are properly configured!")
    return true
  } else {
    console.log(`\n${errors.length > 0 ? "❌" : "⚠️"} Found ${issues.length} export issues`)
    return errors.length === 0 // Only fail on errors, not warnings
  }
}

// Run if called directly
if (require.main === module) {
  const success = generateExportReport()
  process.exit(success ? 0 : 1)
}

export { verifyExports, generateExportReport }
