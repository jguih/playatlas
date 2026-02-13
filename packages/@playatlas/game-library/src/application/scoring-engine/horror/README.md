# Horror Scoring Engine

This classification measures how strongly horror-themed a game is, based on its themes, emotional tone, and the kinds of fear it tries to evoke.

The goal is not to decide whether a game _is_ horror, but how strongly it expresses recognizable horror dimensions.

## Groups

### horror_identity

Evidence of explicit horror identity and recognizable genre conventions.

- **userFacing**: false
- **role**: `identity`

Examples of signals:

- horror genre labeling
- monsters, zombies, demons, or supernatural threats
- gore, violence, or body horror
- haunted locations or cursed settings
- survival against terrifying entities

This is the broad foundation of horror. It captures games that clearly present themselves as horror through themes and imagery.

### resource_survival

Evidence that fear is reinforced by vulnerability and resource pressure.

- **userFacing**: true
- **role**: `dimension`

Examples of signals:

- limited ammunition or supplies
- inventory management under stress
- fragile player characters
- evasion or avoidance of enemies
- tension from scarcity and risk

Focuses on horror created through mechanical vulnerability and survival tension, not just scary aesthetics.

### psychological_horror

Evidence of fear driven by mental, emotional, or perceptual disturbance.

- **userFacing**: true
- **role**: `dimension`

Examples of signals:

- unreliable perception or distorted reality
- themes of madness, trauma, or paranoia
- unsettling narratives
- mind-bending or surreal events
- emotional or existential dread

Captures horror that targets the player’s psyche rather than relying primarily on physical threats.

### combat_engagement

Evidence of combat engagement through the game.

- **userFacing**: true
- **role**: `dimension`

Examples of signals:

- timed dodges
- first person shooter
- third person shooter
- action taxonomy
- usage of weapons to defend yourself

Focuses on engagement with enemies using tools, weapons and consumables.

### atmospheric_horror

Evidence of horror conveyed through mood, environment, and sensory tension.

- **userFacing**: true
- **role**: `dimension`

Examples of signals:

- oppressive or eerie environments
- dark or decaying settings
- unsettling soundscapes
- slow-building dread
- isolation and loneliness

Captures games where horror emerges primarily from ambiance and sustained tension rather than explicit threats.
