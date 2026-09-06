'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/lib/theme';
import { services } from '@/data/services';
import type { ServiceDetail as ServiceDetailType } from '@/data/services';
import { iconMap } from '@/components/ui/Icons';

interface Props {
  service: ServiceDetailType;
}

const FEAT_ICONS = [
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z" /></svg>,
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>,
  <svg key={4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
  <svg key={5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
];

export default function ServiceDetail({ service }: Props) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const ServiceIcon = iconMap[service.icon];
  const others = services.filter((s) => s.id !== service.id);

  const card = dark
    ? 'bg-gray-900/60 border border-gray-700/60'
    : 'bg-white border border-gray-200';

  return (
    <div className={`relative z-10 ${dark ? 'text-white' : 'text-gray-900'}`}>

      {/* SPLIT-SCREEN HEADER */}
      <div className="relative min-h-[540px] flex flex-col lg:flex-row pt-20">

        {/* Left panel */}
        <div className={`relative z-10 flex flex-col justify-center px-5 md:px-14 xl:px-20 py-12 lg:w-[52%] ${dark ? 'bg-[#0B0F14]' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 text-xs font-medium mb-8">
            <Link href="/" className={`${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>Home</Link>
            <span className={dark ? 'text-gray-700' : 'text-gray-300'}>/</span>
            <Link href="/services/network-infrastructure" className={`${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>Services</Link>
            <span className={dark ? 'text-gray-700' : 'text-gray-300'}>/</span>
            <span className="text-accent">{service.title}</span>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/30">
              {ServiceIcon && <ServiceIcon className="w-7 h-7" />}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-gray-400' : 'text-gray-400'}`}>Service</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
            {service.title}
          </h1>
          <p className={`text-lg leading-relaxed mb-8 max-w-lg ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            {service.tagline}
          </p>



          <div className="flex gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-[#00A359] transition-colors">
              Request a Proposal
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href={`/blog?service=${service.id}`} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border transition-colors ${dark ? 'border-gray-700 text-gray-300 hover:border-gray-500' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              Projects
            </Link>
          </div>
        </div>

        {/* Right panel — image */}
        <div className={`relative lg:w-[48%] min-h-[320px] lg:min-h-0 ${!dark ? 'lg:p-8 lg:pl-4 flex items-stretch' : ''}`}>
          <div className={`${dark ? 'absolute inset-0' : 'relative w-full min-h-[320px] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5'}`}>
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
            {/* Dark mode: blend left edge into the dark panel */}
            {dark && <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-[#0B0F14] lg:via-transparent lg:to-transparent" />}
            {/* Bottom vignette */}
            <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${dark ? 'from-black/60' : 'from-black/30'}`} />
          </div>
        </div>
      </div>

      {/* OUTCOMES TICKER BAR */}
      <div className={`border-y ${dark ? 'border-gray-800 bg-black/40' : 'border-gray-100 bg-white/70'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 py-4 flex flex-wrap gap-x-8 gap-y-2">
          {service.outcomes.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{o}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DESCRIPTION + DELIVERABLES */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">About This Service</p>
            {service.longDescription.map((para, i) => (
              <p key={i} className={`text-base leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{para}</p>
            ))}
          </div>
          <div className={`rounded-2xl p-6 h-fit ${card}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-5">Deliverables</p>
            <ul className="space-y-3">
              {service.deliverables.map((d, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                  <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {d}
                </li>
              ))}
            </ul>
            <div className={`mt-6 pt-5 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Standards</p>
              <div className="flex flex-wrap gap-2">
                {service.compliance.map((c, i) => (
                  <span key={i} className={`px-2.5 py-1 rounded-md text-xs font-medium ${dark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-600'}`}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES — 2-col left-border cards */}
      <section className={`py-16 ${dark ? 'bg-black/20' : 'bg-gray-50/80'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Features</p>
            <h2 className={`text-3xl md:text-4xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>What We Offer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feat, i) => (
              <div
                key={i}
                className={`flex gap-4 p-5 rounded-xl border-l-4 border-accent ${dark ? 'bg-gray-900/50 border-r border-t border-b border-r-gray-800 border-t-gray-800 border-b-gray-800' : 'bg-white border-r border-t border-b border-r-gray-100 border-t-gray-100 border-b-gray-100'}`}
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-accent bg-accent/10 mt-0.5">
                  {FEAT_ICONS[i % FEAT_ICONS.length]}
                </div>
                <div>
                  <h3 className={`font-bold text-sm mb-1.5 ${dark ? 'text-white' : 'text-gray-900'}`}>{feat.title}</h3>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — horizontal timeline */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 py-16">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Approach</p>
          <h2 className={`text-3xl md:text-4xl font-black ${dark ? 'text-white' : 'text-gray-900'}`}>Our Process</h2>
        </div>
        {/* Desktop */}
        <div className="hidden md:flex gap-0 relative">
          <div className={`absolute top-5 left-5 right-5 h-px ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} style={{ zIndex: 0 }} />
          {service.process.map((step, i) => (
            <div key={i} className="flex-1 flex flex-col items-start pt-0 relative" style={{ zIndex: 1 }}>
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-black text-white text-xs mb-5">
                {step.step}
              </div>
              <div className="pr-6">
                <h3 className={`font-bold text-sm mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                <p className={`text-xs leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-0">
          {service.process.map((step, i) => (
            <div key={i} className="flex gap-4 relative">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-black text-white text-xs flex-shrink-0">
                  {step.step}
                </div>
                {i < service.process.length - 1 && (
                  <div className={`w-px flex-1 my-2 ${dark ? 'bg-gray-800' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pb-8">
                <h3 className={`font-bold text-sm mb-1.5 ${dark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR — pill tags */}
      <section className={`py-14 ${dark ? 'bg-black/20' : 'bg-gray-50/80'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16">
          <p className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Ideal For</p>
          <h2 className={`text-2xl font-black mb-8 ${dark ? 'text-white' : 'text-gray-900'}`}>Who Is This Service For?</h2>
          <div className="flex flex-wrap gap-3">
            {service.forWhom.map((who, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm ${dark ? 'bg-gray-900/70 border border-gray-700 text-gray-200' : 'bg-white border border-gray-200 text-gray-700'}`}
              >
                <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                {who}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — centered gradient card */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 py-16">
        <div className="rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #00C46A 0%, #0EA5E9 100%)' }} />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10" />
          <div className="relative px-10 py-14 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Get Started</p>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Ready to get started with {service.title}?</h2>
              <p className="text-white/75 text-sm max-w-md">Our engineers will scope, design, and deliver a solution built around your exact requirements.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-white/90 transition-colors whitespace-nowrap">
                Talk to an Engineer
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* OTHER SERVICES — text link strip */}
      <section className={`border-t ${dark ? 'border-gray-800 bg-black/20' : 'border-gray-100 bg-gray-50/60'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 py-12">
          <p className={`text-xs font-bold uppercase tracking-widest mb-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Other Services</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
            {others.map((s) => {
              const ItemIcon = iconMap[s.icon];
              return (
                <Link
                  key={s.id}
                  href={`/services/${s.id}`}
                  className={`group flex items-center gap-3 px-4 py-4 rounded-xl transition-colors ${dark ? 'hover:bg-gray-800/60' : 'hover:bg-white'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${dark ? 'bg-gray-800 group-hover:bg-accent/20 text-gray-400 group-hover:text-accent' : 'bg-gray-100 group-hover:bg-accent/10 text-gray-400 group-hover:text-accent'}`}>
                    {ItemIcon && <ItemIcon className="w-4 h-4" />}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${dark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>{s.title}</span>
                  <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-accent transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
