// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"

// React application
import React from "react"
import { createRoot } from "react-dom/client"
import PromptTester from "./components/PromptTester"

// Mount React app when DOM is ready
document.addEventListener("turbo:load", () => {
  const container = document.getElementById("react-root")
  if (container) {
    const root = createRoot(container)
    root.render(<PromptTester initialColumns={2} />)
  }
})

// Also handle initial page load
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("react-root")
  if (container) {
    const root = createRoot(container)
    root.render(<PromptTester initialColumns={2} />)
  }
})
