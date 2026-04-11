"use client"

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="py-12">
      <section className="mx-4 md:mx-8 lg:mx-16 bg-slate-800/60 rounded-2xl p-8 shadow-inner border border-white/5 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
          <p className="mt-4 text-white/80">We'd love to hear from you. For support, partnership inquiries, or feedback use the form below.</p>

          <form className="mt-6 grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your name" aria-label="Name" className="w-full rounded-md px-3 py-2 bg-white/6 text-white placeholder-slate-400 border border-white/5" />
            <input placeholder="Email" aria-label="Email" className="w-full rounded-md px-3 py-2 bg-white/6 text-white placeholder-slate-400 border border-white/5" />
            <textarea placeholder="How can we help?" aria-label="Message" rows={6} className="w-full rounded-md px-3 py-2 bg-white/6 text-white placeholder-slate-400 border border-white/5" />

            <div className="flex items-center gap-4">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md">Send Message</button>
              <Link href="/help" className="text-white/80 underline">Visit Help Center</Link>
            </div>
          </form>

          <div className="mt-8 text-sm text-white/70">
            <p>Or reach us directly at <a className="underline text-amber-400" href="mailto:support@bhojonbox.example">support@bhojonbox.example</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
