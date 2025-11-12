# DOOM Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)

Retro DOOM-style first-person shooter game as a Lovelace card for Home Assistant! Experience classic 3D ray-casting gameplay right in your HA dashboard.

![DOOM Card](https://via.placeholder.com/640x400/000000/00FF00?text=DOOM+Card)

## Features

- 🎮 **Full 3D Ray-Casting Engine** - Classic DOOM-style rendering
- 🔫 **Multiple Weapons** - Pistol, Shotgun, and Chaingun
- 👾 **Intelligent Enemies** - AI enemies that chase and attack
- 🗺️ **Progressive Difficulty** - More enemies each level
- 🎵 **Retro Sound Effects** - Synthesized weapon sounds
- ⌨️ **IJKL Controls** - Classic keyboard controls with mouse support
- 📊 **HUD Display** - Health, ammo, weapon, and level tracking
- 🎯 **Crosshair Aiming** - Precise targeting system
- 💥 **Particle Effects** - Blood splatter and explosions

## Installation

### HACS (Recommended)

⚠️ **IMPORTANT**: This repository is currently on a development branch. Please follow these steps:

1. Open HACS in your Home Assistant
2. Click on "Frontend"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/joshuaaaaa/DOOM`
6. Select category: "Lovelace"
7. Click "ADD"
8. **After adding**, click on the repository and select branch: `claude/doom-game-hacs-integration-011CV3d8zmxXfsBh4zfcQXCz`
9. Find "DOOM Card" in the list and click "INSTALL"
10. Restart Home Assistant

📖 **Detailed instructions**: See [HACS_INSTALLATION.md](HACS_INSTALLATION.md) for troubleshooting and more details.

### Manual Installation

1. Download `doom-card.js` from this repository
2. Copy it to your `config/www/` directory
3. Add the following to your Lovelace resources:

```yaml
resources:
  - url: /local/doom-card.js
    type: module
```

4. Restart Home Assistant

## Configuration

Add the card to your Lovelace dashboard:

### UI Mode

1. Edit your dashboard
2. Click "Add Card"
3. Search for "DOOM Card"
4. Click to add

### YAML Mode

```yaml
type: custom:doom-card
```

That's it! No additional configuration needed.

## Controls

### Keyboard

- **I** - Move forward
- **K** - Move backward
- **J** - Turn left
- **L** - Turn right
- **Space** - Shoot
- **1** - Switch to Pistol (unlimited ammo)
- **2** - Switch to Shotgun (24 rounds)
- **3** - Switch to Chaingun (100 rounds)
- **ESC** - Pause game

### Mouse

- **Move Mouse** - Look around (automatically locks on game start)
- **Left Click** - Shoot
- **Right Click** - Cycle weapons (next weapon)
- **Mouse Wheel Up** - Previous weapon
- **Mouse Wheel Down** - Next weapon

## Gameplay

### Objective

Survive waves of enemies across multiple levels. Each level increases difficulty with more enemies and higher health pools.

### Weapons

1. **Pistol**
   - Damage: 15
   - Ammo: Unlimited
   - Fire Rate: Medium
   - Best for: Starting weapon, conserving ammo

2. **Shotgun**
   - Damage: 45
   - Ammo: 24 (starts with)
   - Fire Rate: Slow
   - Best for: High damage single shots

3. **Chaingun**
   - Damage: 20
   - Ammo: 100 (starts with)
   - Fire Rate: Very Fast
   - Best for: Continuous fire, multiple enemies

### Enemies

- **Green** - Idle/Patrolling
- **Yellow** - Chasing player
- **Red** - Attacking player

Enemies will detect you when you're within range and chase you. If they get close enough, they'll attack and damage your health.

### Tips

- Keep moving! Standing still makes you an easy target
- Use walls for cover
- Switch weapons based on the situation
- Watch your ammo - pistol has unlimited but lower damage
- Each enemy killed gives you 100 × level points
- Clear all enemies to advance to the next level

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- Web Audio API support
- Canvas 2D rendering
- Pointer Lock API (for mouse look)

## Performance

The game uses efficient ray-casting rendering and should run smoothly on most modern devices. If you experience lag:

- Close other browser tabs
- Reduce browser window size
- Use a less resource-intensive Home Assistant theme

## Troubleshooting

### Card doesn't appear

1. Clear browser cache
2. Check browser console for errors
3. Verify `doom-card.js` is accessible at `/local/doom-card.js`
4. Restart Home Assistant

### Controls not working

1. Make sure you've clicked on the game canvas
2. Check if pointer lock is enabled (click canvas)
3. Try refreshing the page

### No sound

1. Check browser autoplay policies
2. Interact with the page first (click start button)
3. Check browser volume settings

## Development

Want to contribute? Here's how to get started:

```bash
git clone https://github.com/joshuaaaaa/DOOM.git
cd DOOM
# Edit doom-card.js
# Test in Home Assistant
```

## Credits

Inspired by:
- Original DOOM by id Software (1993)
- Ray-casting technique by Lode Vandevenne
- Home Assistant community

## License

MIT License - see LICENSE file for details

## Support

If you enjoy this card, please star the repository! ⭐

For issues and feature requests, please use the [GitHub Issues](https://github.com/joshuaaaaa/DOOM/issues) page.

---

**Made with ❤️ for the Home Assistant community**
