import { useLineReveal } from "./motion";
import { CurtainImage, Eyebrow, FactRows } from "./parts";
import type { ProjectDetail } from "./data";

/** Project information beside the introduction. */
export function ProjectOverview({ project }: { project: ProjectDetail }) {
  const factsRef = useLineReveal<HTMLDivElement>();
  const introRef = useLineReveal<HTMLDivElement>();

  return (
    <section className="shell grid gap-[clamp(3.5rem,6vw,7rem)] py-[clamp(5rem,10vw,9rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.45fr)]">
      <div ref={factsRef} className="min-w-0">
        <Eyebrow>Project information</Eyebrow>
        <div className="mt-8">
          <FactRows rows={project.facts} />
        </div>
      </div>

      <div ref={introRef} className="min-w-0">
        <Eyebrow>Introduction</Eyebrow>
        <h2
          data-line
          className="mt-8 max-w-[14ch] font-display text-[clamp(2.25rem,4.2vw,4rem)] leading-[0.98] font-light tracking-[-0.03em] text-balance text-navy"
        >
          {project.intro.heading}
        </h2>
        <div className="mt-8 max-w-[40rem] space-y-5">
          {project.intro.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              data-line
              className="font-body text-[clamp(1rem,1.15vw,1.0625rem)] leading-[1.8] text-pretty text-slate"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Durall's part in the project, under the widest photograph on the page. */
export function ProjectScope({ project }: { project: ProjectDetail }) {
  const { scope } = project;
  const copyRef = useLineReveal<HTMLDivElement>();

  return (
    <section className="shell py-[clamp(3rem,6vw,5rem)]">
      <CurtainImage
        photo={scope}
        sizes="(min-width: 120rem) 1776px, 92vw"
        className="h-[clamp(22rem,56vw,44rem)] w-full"
      />
      <div
        ref={copyRef}
        className="mt-[clamp(3.5rem,6vw,5.5rem)] ml-auto max-w-[37.5rem] lg:mr-[6%]"
      >
        <Eyebrow>Durall’s scope</Eyebrow>
        <h2
          data-line
          className="mt-8 font-display text-[clamp(2.25rem,4vw,3.75rem)] leading-none font-light tracking-[-0.03em] text-balance text-navy"
        >
          {scope.heading}
        </h2>
        <div className="mt-7 space-y-4">
          {scope.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              data-line
              className="font-body text-[clamp(1rem,1.15vw,1.0625rem)] leading-[1.8] text-pretty text-slate"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-8">
          <FactRows rows={scope.facts} />
        </div>
      </div>
    </section>
  );
}

/** The window system, beside the pavilion it was built into. */
export function ProjectSystem({ project }: { project: ProjectDetail }) {
  const { system } = project;
  const copyRef = useLineReveal<HTMLDivElement>();

  return (
    <section className="shell grid items-end gap-[clamp(3rem,5vw,4.5rem)] py-[clamp(5rem,9vw,9rem)] lg:grid-cols-2">
      <div ref={copyRef} className="min-w-0 max-w-[32rem]">
        <Eyebrow>The system</Eyebrow>
        <h2
          data-line
          className="mt-8 font-display text-[clamp(2.5rem,4.4vw,4rem)] leading-[1.02] font-light tracking-[-0.03em] text-navy"
        >
          {system.title.map((line, index) => (
            <span key={line}>
              {line}
              {index < system.title.length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        <p
          data-line
          className="mt-8 font-body text-[clamp(1rem,1.15vw,1.0625rem)] leading-[1.8] text-pretty text-slate"
        >
          {system.body}
        </p>
        <span data-rule aria-hidden="true" className="mt-8 block h-px w-full bg-navy-14" />
        <ul>
          {system.points.map((point) => (
            <li
              key={point}
              className="relative py-4 font-display text-[0.6875rem] font-bold tracking-[0.16em] text-slate uppercase"
            >
              <span data-rise className="block">
                {point}
              </span>
              <span
                data-rule
                data-with-prev
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px bg-navy-14"
              />
            </li>
          ))}
        </ul>
      </div>
      <CurtainImage
        photo={system}
        sizes="(min-width: 64rem) 46vw, 92vw"
        className="aspect-[4/3] w-full min-w-0"
      />
    </section>
  );
}

/** How the house is lived in, once the work is done. */
export function ProjectExperience({ project }: { project: ProjectDetail }) {
  const { experience } = project;
  const copyRef = useLineReveal<HTMLDivElement>();

  return (
    <section className="shell grid items-center gap-[clamp(3rem,5vw,4.5rem)] pb-[clamp(5rem,9vw,8rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
      <CurtainImage
        photo={experience}
        sizes="(min-width: 64rem) 50vw, 92vw"
        className="aspect-[1.47] w-full min-w-0"
      />
      <div ref={copyRef} className="min-w-0">
        <Eyebrow>The experience</Eyebrow>
        <h2
          data-line
          className="mt-8 font-display text-[clamp(2.25rem,3.8vw,3.5rem)] leading-[1.04] font-light tracking-[-0.03em] text-balance text-navy"
        >
          {experience.heading}
        </h2>
        <p
          data-line
          className="mt-8 max-w-[34rem] font-body text-[clamp(1rem,1.15vw,1.0625rem)] leading-[1.8] text-pretty text-slate"
        >
          {experience.body}
        </p>
      </div>
    </section>
  );
}
