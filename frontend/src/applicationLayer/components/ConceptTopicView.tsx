import { useEffect, useState } from "react";
import { fetchConceptTopic } from "../api";
import type { ConceptTopic } from "../types";

interface ConceptTopicViewProps {
  topicId: string;
}

export function ConceptTopicView({ topicId }: ConceptTopicViewProps) {
  const [topic, setTopic] = useState<ConceptTopic | null>(null);

  useEffect(() => {
    fetchConceptTopic(topicId).then(setTopic);
  }, [topicId]);

  if (!topic) return null;

  return (
    <div className="concept-topic-view">
      <p>{topic.description}</p>
      <ul>
        {topic.keyPoints.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
