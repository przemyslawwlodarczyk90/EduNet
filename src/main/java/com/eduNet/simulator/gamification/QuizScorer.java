package com.eduNet.simulator.gamification;

import java.util.ArrayList;
import java.util.List;

public final class QuizScorer {

    private QuizScorer() {
    }

    public static QuizResult score(Quiz quiz, QuizSubmission submission) {
        List<QuizQuestion> questions = quiz.questions();
        List<Boolean> correctness = new ArrayList<>();
        List<String> explanations = new ArrayList<>();
        int correct = 0;

        for (int i = 0; i < questions.size(); i++) {
            QuizQuestion question = questions.get(i);
            Integer answer = i < submission.answers().size() ? submission.answers().get(i) : null;
            boolean isCorrect = answer != null && answer == question.correctIndex();
            correctness.add(isCorrect);
            explanations.add(question.explanation());
            if (isCorrect) {
                correct++;
            }
        }

        return new QuizResult(quiz.id(), correct, questions.size(), correctness, explanations);
    }

}
