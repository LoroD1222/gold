export function MiniPlanningForm() {
  return (
    <form className="min-h-[443px] rounded-[15px] border border-ink/[.09] bg-white p-[26px] shadow-none" action="https://api.web3forms.com/submit" method="post">
      <input type="hidden" name="access_key" value="9da46659-7080-4382-9076-c9e92dffe2a2" />
      <p className="text-[18px] font-semibold text-brand">Get Started</p>
      <p className="mt-[10px] text-[23px] font-semibold leading-[1.3]">Tell us about your family,<br />we&apos;ll build the trip</p>
      <div className="mt-6 grid gap-3">
        <label className="form-field"><span>First Name</span><input name="firstName" autoComplete="given-name" placeholder="e.g. Sofia" required /></label>
        <label className="form-field"><span>Email Address</span><input type="email" name="email" autoComplete="email" placeholder="e.g. sofia@example.com" required /></label>
        <label className="form-field"><span>WhatsApp Number</span><input type="tel" name="phone" autoComplete="tel" placeholder="e.g. +1 (555) 019-2834" /></label>
        <label className="form-field"><span>Message</span><textarea name="message" rows={3} placeholder="Tell us about your ideal trip" required /></label>
      </div>
      <button type="submit" className="mt-4 min-h-[47px] w-full rounded-[5px] bg-gradient-to-r from-[#f2a93b] to-[#f5be2b] px-4 py-3 text-[16px] font-semibold transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Start Planning My Family&apos;s Trip</button>
    </form>
  );
}
