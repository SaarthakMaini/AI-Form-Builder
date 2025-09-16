import React from 'react'
import { SignInButton } from '@clerk/nextjs'

function Hero() {
  return (
    <section className="bg-black lg:grid lg:h-screen lg:place-content-center dark:bg-gray-900">
  <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-7xl font-bold text-white sm:text-5xl dark:text-white">
        Create Custom Forms
        <strong className="text-[#e28743]"> Using AI In Seconds </strong>
      </h1>

      <p className="mt-4 text-base text-pretty text-white sm:text-lg/relaxed dark:text-gray-200">
        Build intelligent, custom forms in just seconds. Our AI-powered platform streamlines data collection, saves time, and helps you capture exactly what you need without any coding.
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
        <a
          className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          href="#"
        >
          <SignInButton fallbackRedirectUrl="/dashboard" forceRedirectUrl='/dashboard'>Get Started</SignInButton>
        </a>

        <a
          className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
          href="#"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
</section>
  )
}

export default Hero