# Run-Based Scoring Engine

This classification measures how strongly a game is structured around discrete procedural runs with reset loops.

## Groups

### procedural_runs

Evidence that gameplay sessions are built from procedural or semi-procedural generation.

Examples of signals:

- procedural generation
- randomized levels
- generated dungeons/maps
- unpredictable layouts

This is the structural backbone of **roguelikes** and **roguelites**.

### permadeath_reset

Evidence that failure causes a full or near-full run reset.

Examples of signals

- permadeath
- run resets
- start over after death
- loss of run progress

Distinguishes run-based games from checkpoint-driven progression.

### run_variability

Evidence that each run meaningfully changes builds or playstyle.

Examples of signals

- randomized items
- build variety
- evolving loadouts
- run-specific upgrades

About intra-run diversity, not just procedural maps.

### meta_progression

Evidence of persistent progression across runs.

Examples of signals

- unlockables between runs
- permanent upgrades
- hub progression
- long-term unlock systems

Tilts toward roguelite structure.
