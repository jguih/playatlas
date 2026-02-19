# Run-Based Scoring Engine

This classification measures how strongly a game is structured around discrete procedural runs with reset loops.

## Groups

### run_based_identity

Evidence of explicit run-based identity and recognizable genre conventions.

- **userFacing**: false
- **role**: `identity`

Examples of signals:

- roguelike genre labeling
- roguelite genre labeling
- run-loop related language
- 'learning from failure' related language

Foundation of run-based games, where the player plays through a session, finishing it by either dying or completing the main objective.

### procedural_runs

Evidence that gameplay sessions are built from procedural or semi-procedural generation.

- **userFacing**: true
- **role**: `dimension`

Examples of signals:

- procedural generation
- randomized levels
- generated dungeons/maps
- unpredictable layouts

This is the structural backbone of **roguelikes** and **roguelites**.

### permadeath_reset

Evidence that failure causes a full or near-full run reset.

- **userFacing**: true
- **role**: `dimension`

Examples of signals

- permadeath
- run resets
- start over after death
- loss of run progress

Distinguishes run-based games from checkpoint-driven progression.

### run_variability

Evidence that each run meaningfully changes builds or playstyle.

- **userFacing**: true
- **role**: `dimension`

Examples of signals

- randomized items
- build variety
- evolving loadouts
- run-specific upgrades

About intra-run diversity, not just procedural maps.

### meta_progression

Evidence of persistent progression across runs.

- **userFacing**: true
- **role**: `dimension`

Examples of signals

- unlockables between runs
- permanent upgrades
- hub progression
- long-term unlock systems

Tilts toward roguelite structure.

## Canonical References

- [Dead Cells](https://store.steampowered.com/app/588650/Dead_Cells/)
- [Hades](https://store.steampowered.com/app/1145360/Hades/)
- [The Binding of Isaac](https://store.steampowered.com/app/250900/The_Binding_of_Isaac_Rebirth/)
- [Risk of Rain 2](https://store.steampowered.com/app/632360/Risk_of_Rain_2/)
- [Mewgenics](https://store.steampowered.com/app/686060/Mewgenics/)
