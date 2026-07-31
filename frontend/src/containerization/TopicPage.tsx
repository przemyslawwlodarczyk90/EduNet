import { ContainerScenarioPlayer } from "./simulation/components/ContainerScenarioPlayer";
import type { ContainerTopic } from "./topics";

interface TopicPageProps {
  topic: ContainerTopic;
}

export function TopicPage({ topic }: TopicPageProps) {
  return (
    <section className="container-topic-page">
      <div className="container-topic-header">
        <h2>{topic.title}</h2>
        <span className={`container-difficulty-badge container-difficulty-${topic.difficulty}`}>
          Poziom: {topic.difficulty}
        </span>
      </div>
      <p className="container-topic-intro">{topic.intro}</p>
      <ContainerScenarioPlayer key={topic.id} scenarioId={topic.id} />
    </section>
  );
}
