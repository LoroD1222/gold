export function MiniPlanningForm() {
  return (
    <form className="min-h-[443px] rounded-[15px] border border-ink/[.09] bg-white p-[26px] shadow-none" action="https://safari-digital-portal.vercel.app/api/inquiries" method="post" data-inquiry-form data-redirect="/thank-you">
      <input type="hidden" name="key" value="sdf_0szf-ca_naLURplsT9y-iMVO" />
      <input type="hidden" name="redirect" value="https://goldentrips.com/thank-you" />
      <p className="text-[18px] font-semibold text-brand">Get Started</p>
      <p className="mt-[10px] text-[23px] font-semibold leading-[1.3]">Tell us about your family,<br />we&apos;ll build the trip</p>
      <div className="mt-6 grid gap-3">
        <label className="form-field"><span>Name</span><input name="name" autoComplete="name" placeholder="e.g. Sofia" required /></label>
        <label className="form-field"><span>Email Address</span><input type="email" name="email" autoComplete="email" placeholder="e.g. sofia@example.com" /></label>
        <label className="form-field"><span>WhatsApp Number</span><input type="tel" name="phone" autoComplete="tel" placeholder="e.g. +1 (555) 019-2834" /></label>
        <label className="form-field"><span>Message</span><textarea name="message" rows={3} placeholder="Tell us about your ideal trip" /></label>
      </div>
      <input name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button type="submit" className="mt-4 min-h-[47px] w-full rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 py-3 text-[16px] font-semibold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Start Planning My Family&apos;s Trip</button>
      <p data-inquiry-status role="status" className="mt-3 min-h-5 text-sm text-muted" />
    </form>
  );
}
