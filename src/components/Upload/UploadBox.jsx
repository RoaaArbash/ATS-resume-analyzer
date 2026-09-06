import { useState } from "react";

const UploadBox = ({ onFileUpload }) => {
  const [isTextMode, setIsTextMode] = useState(false);
  const [text, setText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handlePasteSubmit = () => {
    const cleanText = text.trim();

    if (cleanText) {
      onFileUpload(cleanText);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <section
      className="mx-auto w-full max-w-2xl"
      aria-labelledby="resume-upload-title"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)]">
        {/* Header */}
        <header className="border-b border-slate-100 px-5 py-7 text-center sm:px-8 sm:py-8">
          <div className="mx-auto flex max-w-lg flex-col items-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5">
              <span
                className="h-2 w-2 rounded-full bg-indigo-600"
                aria-hidden="true"
              />

              <span className="text-xs font-semibold text-indigo-700">
                ATS Resume Analysis
              </span>
            </div>

            <h2
              id="resume-upload-title"
              className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
            >
              Analyze your resume
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-[15px]">
              Upload your resume or paste its content to check ATS
              compatibility and identify areas for improvement.
            </p>
          </div>
        </header>

        {/* Body */}
        <div className="p-5 sm:p-8">
          {/* Tabs */}
          <div
            className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1"
            role="tablist"
            aria-label="Resume input method"
          >
            <button
              type="button"
              role="tab"
              id="upload-file-tab"
              aria-selected={!isTextMode}
              aria-controls="upload-file-panel"
              onClick={() => setIsTextMode(false)}
              className={`
                inline-flex min-h-10 items-center justify-center gap-2
                rounded-lg px-3 py-2.5
                text-sm font-semibold
                transition-[background-color,color,box-shadow] duration-200
                outline-none
                focus-visible:ring-2 focus-visible:ring-indigo-500
                focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100
                ${
                  !isTextMode
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }
              `}
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M3.75 7.75A2.75 2.75 0 0 1 6.5 5h3.086c.464 0 .91.184 1.238.512L12.312 7H17.5a2.75 2.75 0 0 1 2.75 2.75v6.75a2.75 2.75 0 0 1-2.75 2.75h-11a2.75 2.75 0 0 1-2.75-2.75V7.75Z"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Upload file
            </button>

            <button
              type="button"
              role="tab"
              id="paste-text-tab"
              aria-selected={isTextMode}
              aria-controls="paste-text-panel"
              onClick={() => setIsTextMode(true)}
              className={`
                inline-flex min-h-10 items-center justify-center gap-2
                rounded-lg px-3 py-2.5
                text-sm font-semibold
                transition-[background-color,color,box-shadow] duration-200
                outline-none
                focus-visible:ring-2 focus-visible:ring-indigo-500
                focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100
                ${
                  isTextMode
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }
              `}
            >
              <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  d="m14.69 5.31 4 4M5 19l2.13-5.32L16.44 4.4a2 2 0 0 1 2.83 0l.33.33a2 2 0 0 1 0 2.83l-9.28 9.31L5 19Z"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              Paste text
            </button>
          </div>

          {isTextMode ? (
            /* Paste Text */
            <div
              id="paste-text-panel"
              role="tabpanel"
              aria-labelledby="paste-text-tab"
            >
              <div className="mb-2 flex items-end justify-between gap-4">
                <label
                  htmlFor="resume-text"
                  className="text-sm font-semibold text-slate-800"
                >
                  Resume content
                </label>

                <span
                  className="text-xs tabular-nums text-slate-400"
                  aria-live="polite"
                >
                  {text.length.toLocaleString()} characters
                </span>
              </div>

              <textarea
                id="resume-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your resume content here..."
                spellCheck="false"
                className="
                  min-h-56 w-full resize-y rounded-xl
                  border border-slate-200 bg-white
                  px-4 py-3.5
                  text-sm leading-6 text-slate-800
                  shadow-sm outline-none
                  transition-[border-color,box-shadow] duration-200
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-indigo-500
                  focus:ring-4 focus:ring-indigo-500/10
                "
              />

              <p className="mt-2 text-xs leading-5 text-slate-500">
                For a more complete analysis, include your experience or
                projects, education, skills, and contact information.
              </p>

              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={!text.trim()}
                className="
                  mt-5 inline-flex min-h-12 w-full
                  items-center justify-center gap-2
                  rounded-xl bg-indigo-600
                  px-5 py-3
                  text-sm font-semibold text-white
                  shadow-sm
                  transition-[background-color,box-shadow,transform] duration-200
                  hover:bg-indigo-700 hover:shadow-md
                  active:translate-y-px
                  disabled:cursor-not-allowed
                  disabled:bg-slate-200
                  disabled:text-slate-400
                  disabled:shadow-none
                  focus:outline-none
                  focus-visible:ring-4
                  focus-visible:ring-indigo-500/20
                "
              >
                Analyze resume

                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14m-5-5 5 5-5 5"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            /* Upload File */
            <div
              id="upload-file-panel"
              role="tabpanel"
              aria-labelledby="upload-file-tab"
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();

                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsDragging(false);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);

                  const droppedFile = e.dataTransfer.files?.[0];

                  if (droppedFile) {
                    handleFileChange(droppedFile);
                  }
                }}
                className={`
                  group relative flex min-h-[270px]
                  flex-col items-center justify-center
                  overflow-hidden rounded-2xl
                  border-2 border-dashed
                  px-5 py-8 text-center
                  transition-[border-color,background-color,box-shadow] duration-200
                  focus-within:ring-4 focus-within:ring-indigo-500/10
                  ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/80 shadow-inner"
                      : "border-slate-200 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/30"
                  }
                `}
              >
                <input
                  type="file"
                  aria-label="Upload your resume"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="
                    absolute inset-0 z-10
                    h-full w-full cursor-pointer opacity-0
                    focus:outline-none
                  "
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];

                    if (selectedFile) {
                      handleFileChange(selectedFile);
                    }
                  }}
                />

                <div
                  className={`
                    mb-5 flex h-14 w-14 items-center justify-center
                    rounded-xl border bg-white shadow-sm
                    transition-[border-color,background-color,transform,box-shadow]
                    duration-200
                    ${
                      isDragging
                        ? "scale-105 border-indigo-200 bg-indigo-50 shadow-md"
                        : "border-slate-200 group-hover:border-indigo-200 group-hover:shadow-md"
                    }
                  `}
                >
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 15V4m0 0L8 8m4-4 4 4M5 15.5v1.75A2.75 2.75 0 0 0 7.75 20h8.5A2.75 2.75 0 0 0 19 17.25V15.5"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  {isDragging ? "Drop your resume here" : "Upload your resume"}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {isDragging ? (
                    "Release the file to start your ATS analysis."
                  ) : (
                    <>
                      Drag and drop your file here, or{" "}
                      <span className="font-semibold text-indigo-600">
                        choose a file
                      </span>
                    </>
                  )}
                </p>

                <div
                  className="mt-5 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Supported file formats"
                >
                  {["PDF", "PNG", "JPG"].map((format) => (
                    <span
                      key={format}
                      className="
                        rounded-md border border-slate-200
                        bg-white px-2.5 py-1
                        text-[11px] font-semibold
                        tracking-wide text-slate-500
                      "
                    >
                      {format}
                    </span>
                  ))}
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Maximum file size: 10 MB
                </p>
              </div>

              {/* Info */}
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <svg
                    className="h-4 w-4 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 16v-4m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  Text-based PDFs usually provide the most accurate ATS
                  analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadBox;