import Link from 'next/link';
import { COMPANY_RECORD_URL, HOME_SUMMARY_UPDATED, getHomeTrustContent } from '@/lib/home-trust-content';
export default function HomeTrustContent({locale, siteUrl}: {locale: string; siteUrl: string}) {
  const copy=getHomeTrustContent(locale);
  const links=[COMPANY_RECORD_URL, '/'+locale+'/about', '/'+locale+'/financial-transparency', '/'+locale+'/privacy', '/'+locale+'/complaints'];
  const faq={ '@context':'https://schema.org', '@type':'FAQPage', '@id':siteUrl+'/'+locale+'/#official-answers', mainEntity:copy.faq.map(([question,answer],i)=>({'@type':'Question',name:question,url:siteUrl+'/'+locale+'/#official-answer-'+i,acceptedAnswer:{'@type':'Answer',text:answer}})) };
  return <section id="official-information" className="bg-slate-50 border-y border-slate-100 py-12" dir={locale==='ar'?'rtl':'ltr'}>
    <div className="max-w-screen-xl mx-auto px-6">
      <header className="max-w-3xl mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{copy.heading}</h2>
        <p className="mt-4 text-slate-700 leading-loose">{copy.intro}</p>
        <p className="mt-3 text-sm text-slate-600">{copy.publisher}: <Link rel="author" href={'/'+locale+'/about'} className="underline">For Relief Humanitarian Foundation (4Relief)</Link> · {copy.updated}: <time dateTime={HOME_SUMMARY_UPDATED}>{HOME_SUMMARY_UPDATED}</time></p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {copy.faq.map(([question,answer],i)=><section key={question} id={'official-answer-'+i} className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-slate-900"><a href={'#official-answer-'+i}>{question}</a></h3><p className="mt-3 leading-loose text-slate-700">{answer}</p>
        </section>)}
        <section className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="text-lg font-bold text-slate-900">{copy.stepsTitle}</h3><ol className="list-decimal ps-6 mt-3 space-y-3 text-slate-700 leading-loose">{copy.steps.map(step=><li key={step}>{step}</li>)}</ol></section>
      </div>
      <aside className="mt-8 border-t border-slate-200 pt-6"><h3 className="font-bold text-slate-900">{copy.sources}</h3><p className="text-slate-700 leading-loose mt-3">{copy.sourceNote}</p><ul className="flex flex-wrap gap-5 mt-4">{links.map((href,i)=><li key={href}><a href={href} className="text-blue-700 underline underline-offset-4">{copy.links[i]}</a></li>)}</ul></aside>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faq).replace(/</g,'\u003c')}} />
  </section>;
}
