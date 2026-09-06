// src/components/Resume/ResumeTemplate.jsx

const ResumeSection = ({ title, items, isList = true }) => {
  if (!items) return null;

  if (Array.isArray(items) && items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold uppercase border-b-2 border-gray-800 pb-1 mb-3">
        {title}
      </h2>

      {isList ? (
        <ul className="list-disc ml-6 space-y-2">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="leading-7 whitespace-pre-wrap">
          {items}
        </p>
      )}
    </section>
  );
};

const ResumeTemplate = ({ resume }) => {
  return (
    <div className="bg-white max-w-4xl mx-auto shadow-xl rounded-xl p-10 print:shadow-none print:rounded-none print:p-8">

      {/* HEADER */}

      <header className="text-center border-b pb-6 mb-8">

        <h1 className="text-4xl font-bold tracking-wide uppercase">
          {resume.name || "Your Name"}
        </h1>

        <div className="mt-4 flex flex-wrap justify-center gap-6 text-gray-700">

          {resume.email && (
            <span>{resume.email}</span>
          )}

          {resume.phone && (
            <span>{resume.phone}</span>
          )}

          {resume.linkedin && (
            <span>{resume.linkedin}</span>
          )}

        </div>

      </header>

      {/* SUMMARY */}

      <ResumeSection
        title="Professional Summary"
        items={resume.summary}
        isList={false}
      />

      {/* SKILLS */}

      <ResumeSection
        title="Technical Skills"
        items={resume.skills}
      />

      {/* EXPERIENCE */}

      <ResumeSection
        title="Experience"
        items={resume.experience}
      />

      {/* PROJECTS */}

      <ResumeSection
        title="Projects"
        items={resume.projects}
      />

      {/* EDUCATION */}

      <ResumeSection
        title="Education"
        items={resume.education}
      />

    </div>
  );
};

export default ResumeTemplate;