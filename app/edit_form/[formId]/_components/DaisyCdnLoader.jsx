"use client"
import { useEffect } from "react"

export default function DaisyCdnLoader() {
  useEffect(() => {
    const ensureTag = (tagName, attrs, id) => {
      if (id && document.getElementById(id)) return document.getElementById(id)
      const el = document.createElement(tagName)
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
      if (id) el.id = id
      document.head.appendChild(el)
      return el
    }

    const linkMain = ensureTag(
      "link",
      { rel: "stylesheet", type: "text/css", href: "https://cdn.jsdelivr.net/npm/daisyui@5" },
      "__daisyui_main__"
    )
    const scriptTw = ensureTag(
      "script",
      { src: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4" },
      "__tw_browser__"
    )
    const linkThemes = ensureTag(
      "link",
      { rel: "stylesheet", type: "text/css", href: "https://cdn.jsdelivr.net/npm/daisyui@5/themes.css" },
      "__daisyui_themes__"
    )

    return () => {
      // Keep assets cached for other mounts; do not remove to avoid FOUC on re-mounts
    }
  }, [])

  return null
}


