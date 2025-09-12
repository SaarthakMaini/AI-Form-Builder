"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

export default function FormIframe({ children, theme, className, style }) {
  const iframeRef = useRef(null)
  const [mountEl, setMountEl] = useState(null)
  const [contentHeight, setContentHeight] = useState(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const onLoad = () => {
      const doc = iframe.contentDocument
      if (!doc) return

      // Inject DaisyUI + Tailwind browser only into iframe
      const linkMain = doc.createElement("link")
      linkMain.rel = "stylesheet"
      linkMain.type = "text/css"
      linkMain.href = "https://cdn.jsdelivr.net/npm/daisyui@5"

      const linkThemes = doc.createElement("link")
      linkThemes.rel = "stylesheet"
      linkThemes.type = "text/css"
      linkThemes.href = "https://cdn.jsdelivr.net/npm/daisyui@5/themes.css"

      const scriptTw = doc.createElement("script")
      scriptTw.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"

      const styleReset = doc.createElement("style")
      styleReset.textContent = `html,body{margin:0;padding:0;background:transparent} #form-iframe-root{display:block}`

      const mount = doc.createElement("div")
      mount.id = "form-iframe-root"
      if (theme) mount.setAttribute("data-theme", theme)

      doc.head.appendChild(linkMain)
      doc.head.appendChild(linkThemes)
      doc.head.appendChild(scriptTw)
      doc.head.appendChild(styleReset)
      doc.body.appendChild(mount)

      setMountEl(mount)
    }

    // Force about:blank to trigger load
    if (!iframe.src) iframe.src = "about:blank"
    iframe.addEventListener("load", onLoad)
    if (iframe.contentDocument?.readyState === "complete") onLoad()
    return () => iframe.removeEventListener("load", onLoad)
  }, [theme])

  useEffect(() => {
    if (mountEl) {
      if (theme) mountEl.setAttribute("data-theme", theme)
      else mountEl.removeAttribute("data-theme")
    }
  }, [mountEl, theme])

  // Auto-size iframe height to content
  useEffect(() => {
    if (!mountEl || !iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    const ro = new ResizeObserver(() => {
      const height = doc.documentElement.scrollHeight
      setContentHeight(height)
    })
    ro.observe(mountEl)
    // Initial measure
    const initial = doc.documentElement.scrollHeight
    setContentHeight(initial)
    return () => ro.disconnect()
  }, [mountEl])

  const portalTarget = useMemo(() => mountEl, [mountEl])

  return (
    <div className={className} style={style}>
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: contentHeight ? `${contentHeight}px` : undefined, border: 0, display: "block" }}
      />
      {portalTarget ? createPortal(children, portalTarget) : null}
    </div>
  )
}


