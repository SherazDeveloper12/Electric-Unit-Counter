export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight mb-6">About Bijli</h1>
      <div className="space-y-5 text-muted leading-relaxed">
        <p>
          Bijli was built to solve one small, recurring annoyance: not knowing how much
          electricity you have used until the bill arrives. Paper bills show up late, and by
          then it is too late to change anything.
        </p>
        <p>
          Bijli connects to your MEPCO meter using the reference number printed on your bill,
          and fetches your latest official reading automatically. Between bills, you can log
          your own meter reading any time, and Bijli calculates exactly how many units you have
          used since your last bill.
        </p>
        <p>
          Every meter gets a simple status — from Good to Dead — so you can tell at a glance
          whether this month is on track or running high.
        </p>
        <p>
          This is an independent tool and is not affiliated with MEPCO or PITC. It reads
          publicly available bill data on your behalf, using the reference number you provide.
        </p>
      </div>
    </main>
  );
}