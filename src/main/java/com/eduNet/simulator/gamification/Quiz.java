package com.eduNet.simulator.gamification;

import java.util.List;
import java.util.Set;

import com.eduNet.simulator.core.OsiLayer;

public record Quiz(String id, String title, String moduleId, Set<OsiLayer> osiLayers, List<QuizQuestion> questions) {
}
