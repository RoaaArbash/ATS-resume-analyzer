import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateOptimizedContent } from "../services/optimizerService";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const result = state?.result ?? null;

  const score = result?.finalScore ?? 0;
  const issues = result?.issues ?? [];
  const strengths = result?.strengths ?? [];
  const extractedText = result?.extractedText ?? "";
  const matchedKeywords = result?.matchedKeywords ?? [];
  const missingKeywords = result?.missingKeywords ?? [];
  const breakdown = result?.breakdown ?? null;

  const { finalCVText, changesLog } = useMemo(() => {
    return generateOptimizedContent(issues, extractedText);
  }, [issues, extractedText]);

  const getScoreConfig = (value) => {
    if (value >= 90) {
      return {
        label: "Excellent",
        description:
          "Your resume demonstrates strong ATS compatibility across the evaluated criteria.",
        text: "text-emerald-700",
        bar: "bg-emerald-500",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        softBg: "bg-emerald-50",
      };
    }

    if (value >= 80) {
      return {
        label: "Good",
        description:
          "Your resume performs well overall, with a few opportunities for further optimization.",
        text: "text-emerald-700",
        bar: "bg-emerald-500",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        softBg: "bg-emerald-50",
      };
    }

    if (value >= 70) {
      return {
        label: "Needs Improvement",
        description:
          "Your resume is usable, but several improvements could strengthen its ATS compatibility.",
        text: "text-amber-700",
        bar: "bg-amber-500",
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        softBg: "bg-amber-50",
      };
    }

    return {
      label: "Poor ATS Compatibility",
      description:
        "Your resume contains issues that may significantly reduce its performance in ATS screening.",
      text: "text-rose-700",
      bar: "bg-rose-500",
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      softBg: "bg-rose-50",
    };
  };

  const scoreConfig = getScoreConfig(score);

  const handleCopy = async () => {
    if (!finalCVText) return;

    try {
      await navigator.clipboard.writeText(finalCVText);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const breakdownItems = breakdown
    ? [
        {
          label: "Format",
          value: breakdown.formatScore ?? 0,
          max: 10,
        },
        {
          label: "Contact",
          value: breakdown.contactScore ?? 0,
          max: 15,
        },
        {
          label: "Sections",
          value: breakdown.sectionsScore ?? 0,
          max: 15,
        },
        {
          label: "Keywords",
          value: breakdown.keywordScore ?? 0,
          max: 25,
        },
        {
          label: "Skills",
          value: breakdown.skillsScore ?? 0,
          max: 15,
        },
        {
          label: "Experience",
          value: breakdown.experienceScore ?? 0,
          max: 10,
        },
        {
          label: "Formatting",
          value: breakdown.formattingScore ?? 0,
          max: 10,
        },
      ]
    : [];

  if (!result) {
    return (
      <main className="min-h-screen bg-slate-50 px-4">
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center py-12">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)] sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <svg
                className="h-6 w-6 text-slate-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M9 3.75h6M9 3.75a2.25 2.25 0 0 0-2.25 2.25v12A2.25 2.25 0 0 0 9 20.25h6A2.25 2.25 0 0 0 17.25 18V6A2.25 2.25 0 0 0 15 3.75M9 3.75v1.5h6v-1.5M9 10h6m-6 4h4"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
              No analysis available
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upload or paste a resume first to generate your ATS compatibility
              report.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="
                mt-6 inline-flex min-h-11 w-full
                items-center justify-center gap-2
                rounded-xl bg-indigo-600
                px-5 py-3
                text-sm font-semibold text-white
                shadow-sm
                transition-[background-color,box-shadow,transform] duration-200
                hover:bg-indigo-700 hover:shadow-md
                active:translate-y-px
                focus:outline-none
                focus-visible:ring-4 focus-visible:ring-indigo-500/20
              "
            >
              Analyze a resume
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="m8.5 12 2.25 2.25L15.5 9.5"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle cx="12" cy="12" r="8.25" strokeWidth="1.7" />
              </svg>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                ATS Resume Analyzer
              </p>

              <p className="text-xs text-slate-500">
                Resume analysis report
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              inline-flex min-h-10 shrink-0 items-center justify-center gap-2
              rounded-lg border border-slate-200 bg-white
              px-3 sm:px-4
              text-sm font-semibold text-slate-700
              shadow-sm
              transition-[background-color,border-color,color,box-shadow]
              duration-200
              hover:border-slate-300 hover:bg-slate-50
              hover:text-slate-950
              focus:outline-none
              focus-visible:ring-4 focus-visible:ring-indigo-500/10
            "
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                d="m14.5 6-6 6 6 6"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="hidden sm:inline">Analyze another</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Page Intro */}
        <section className="mb-7 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5">
            <span
              className="h-2 w-2 rounded-full bg-indigo-600"
              aria-hidden="true"
            />

            <span className="text-xs font-semibold text-indigo-700">
              Analysis complete
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Your ATS compatibility report
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
            Review your score, understand the detected issues, and use the
            recommendations below to strengthen your resume.
          </p>
        </section>

        {/* Main Score */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="grid lg:grid-cols-[0.9fr_1.35fr]">
            {/* Score Number */}
            <div className="flex flex-col justify-center border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-sm font-semibold text-slate-500">
                Overall ATS score
              </p>

              <div className="mt-4 flex items-end gap-2">
                <span
                  className={`text-6xl font-bold tracking-[-0.04em] sm:text-7xl ${scoreConfig.text}`}
                >
                  {score}
                </span>

                <span className="mb-2 text-lg font-semibold text-slate-400">
                  /100
                </span>
              </div>

              <div
                className={`mt-5 w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${scoreConfig.badge}`}
              >
                {result.compatibilityLevel || scoreConfig.label}
              </div>
            </div>

            {/* Summary */}
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <h2 className="text-lg font-bold text-slate-950">
                Resume evaluation
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                {scoreConfig.description}
              </p>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    Compatibility level
                  </span>

                  <span
                    className={`text-xs font-bold tabular-nums ${scoreConfig.text}`}
                  >
                    {score}%
                  </span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label="ATS compatibility score"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={score}
                >
                  <div
                    className={`h-full rounded-full ${scoreConfig.bar}`}
                    style={{
                      width: `${Math.min(100, Math.max(0, score))}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Cards */}
        <section
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
          aria-label="Analysis summary"
        >
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                Score
              </p>

              <div className={`h-2.5 w-2.5 rounded-full ${scoreConfig.bar}`} />
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              {score}
              <span className="ml-1 text-sm font-semibold text-slate-400">
                /100
              </span>
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                Issues
              </p>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50">
                <svg
                  className="h-4 w-4 text-rose-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M12 8.5v4.25m0 3h.01"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <circle cx="12" cy="12" r="8.25" strokeWidth="1.7" />
                </svg>
              </div>
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              {issues.length}
            </p>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                Recommendations
              </p>

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                <svg
                  className="h-4 w-4 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="m7.5 12.25 2.75 2.75 6.25-6.25"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              {changesLog.length}
            </p>
          </article>
        </section>

        {/* Score Breakdown */}
        {breakdownItems.length > 0 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-base font-bold text-slate-950">
                Score breakdown
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See how each ATS evaluation category contributed to your final
                score.
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
              {breakdownItems.map((item) => {
                const percentage =
                  item.max > 0
                    ? Math.min(
                        100,
                        Math.max(0, (item.value / item.max) * 100)
                      )
                    : 0;

                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>

                      <span className="text-xs font-semibold tabular-nums text-slate-500">
                        {item.value}/{item.max}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Issues + Improvements */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Issues */}
          <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                  <svg
                    className="h-5 w-5 text-rose-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 8.25v4.5m0 3h.01"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />

                    <path
                      d="M10.17 4.76 3.08 17.12A1.75 1.75 0 0 0 4.6 19.75h14.8a1.75 1.75 0 0 0 1.52-2.63L13.83 4.76a2.11 2.11 0 0 0-3.66 0Z"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-950">
                    Detected issues
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Factors that may reduce ATS performance
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold tabular-nums text-rose-700">
                {issues.length}
              </span>
            </header>

            <div className="flex-1 p-4 sm:p-5">
              {issues.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                    <svg
                      className="h-6 w-6 text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="m7 12.25 3 3 7-7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    No major issues detected
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                    Your resume passed the structural checks currently included
                    in the analyzer.
                  </p>
                </div>
              ) : (
                <ul className="max-h-[430px] space-y-2.5 overflow-y-auto pr-1">
                  {issues.map((issue, index) => (
                    <li
                      key={`${issue}-${index}`}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                        !
                      </span>

                      <p className="text-sm leading-6 text-slate-600">
                        {issue}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>

          {/* Recommendations */}
          <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <svg
                    className="h-5 w-5 text-emerald-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="m7 12.25 3 3 7-7"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-950">
                    Recommended improvements
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Actions to strengthen your resume
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold tabular-nums text-emerald-700">
                {changesLog.length}
              </span>
            </header>

            <div className="flex-1 p-4 sm:p-5">
              {changesLog.length > 0 ? (
                <ul className="max-h-[430px] space-y-2.5 overflow-y-auto pr-1">
                  {changesLog.map((change, index) => (
                    <li
                      key={`${change}-${index}`}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <svg
                          className="h-3 w-3 text-emerald-700"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            d="m6 12 4 4 8-8"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>

                      <p className="text-sm leading-6 text-slate-600">
                        {change}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex min-h-[260px] flex-col items-center justify-center px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <svg
                      className="h-5 w-5 text-slate-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 7.5v5m0 4h.01"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />

                      <circle cx="12" cy="12" r="8.25" strokeWidth="1.7" />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    No recommendations available
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
                    No additional optimization suggestions were generated for
                    this analysis.
                  </p>
                </div>
              )}
            </div>
          </article>
        </section>

        {/* Strengths */}
        {strengths.length > 0 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="m7 12.25 3 3 7-7"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-950">
                  Resume strengths
                </h2>

                <p className="text-xs text-slate-500">
                  Areas that performed well during the ATS analysis
                </p>
              </div>
            </div>

            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {strengths.map((strength, index) => (
                <li
                  key={`${strength}-${index}`}
                  className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                    <svg
                      className="h-3 w-3 text-indigo-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        d="m6 12 4 4 8-8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    {strength}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Job Keywords */}
        {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                Job description keyword match
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keywords detected from the job description compared with your
                resume.
              </p>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Matched keywords
                  </h3>

                  <span className="text-xs font-bold text-emerald-700">
                    {matchedKeywords.length}
                  </span>
                </div>

                {matchedKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {matchedKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No matching keywords detected.
                  </p>
                )}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Missing keywords
                  </h3>

                  <span className="text-xs font-bold text-rose-700">
                    {missingKeywords.length}
                  </span>
                </div>

                {missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {missingKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No missing keywords detected.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Optimized Text */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-base font-bold text-slate-950">
                Optimized resume content
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Copy the generated content and use it as a starting point when
                revising your resume.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!finalCVText}
              className={`
                inline-flex min-h-11 shrink-0
                items-center justify-center gap-2
                rounded-xl px-5 py-3
                text-sm font-semibold text-white
                shadow-sm
                transition-[background-color,box-shadow,transform] duration-200
                active:translate-y-px
                disabled:cursor-not-allowed
                disabled:bg-slate-300 disabled:shadow-none
                focus:outline-none focus-visible:ring-4
                ${
                  copied
                    ? "bg-emerald-600 focus-visible:ring-emerald-500/20"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md focus-visible:ring-indigo-500/20"
                }
              `}
            >
              {copied ? (
                <>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="m6 12 4 4 8-8"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  Copied
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <rect
                      x="8.5"
                      y="8.5"
                      width="11"
                      height="11"
                      rx="2"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M15.5 5.5V4.75A2.25 2.25 0 0 0 13.25 2.5h-8.5A2.25 2.25 0 0 0 2.5 4.75v8.5a2.25 2.25 0 0 0 2.25 2.25h.75"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>

                  Copy optimized text
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Result;