package com.eduNet.containerization.gamification;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class ContainerQuizScorer {

    private static final Logger log = LoggerFactory.getLogger(ContainerQuizScorer.class);

    private ContainerQuizScorer() {
    }

    public static ContainerQuizResult score(ContainerQuiz quiz, ContainerQuizSubmission submission) {
        List<ContainerQuizQuestion> questions = quiz.questions();
        List<Boolean> correctness = new ArrayList<>();
        List<String> explanations = new ArrayList<>();
        int correct = 0;

        for (int i = 0; i < questions.size(); i++) {
            ContainerQuizQuestion question = questions.get(i);
            Integer answer = i < submission.answers().size() ? submission.answers().get(i) : null;
            boolean isCorrect = answer != null && answer == question.correctIndex();
            correctness.add(isCorrect);
            explanations.add(question.explanation());
            if (isCorrect) {
                correct++;
            }
        }

        log.info("container quiz scored id={} correct={}/{}", quiz.id(), correct, questions.size());
        return new ContainerQuizResult(quiz.id(), correct, questions.size(), correctness, explanations);
    }

}
