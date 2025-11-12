# HACS Instalace / HACS Installation

## 🇨🇿 Česky

### Přidání do HACS

1. Otevřete **HACS** v Home Assistant
2. Klikněte na **Frontend** (Lovelace)
3. Klikněte na **⋮** (tři tečky) v pravém horním rohu
4. Vyberte **Custom repositories**
5. Vyplňte:
   - **Repository**: `https://github.com/joshuaaaaa/DOOM`
   - **Category**: `Lovelace`
   - ⚠️ **DŮLEŽITÉ**: Po přidání repository, vyberte správný branch v nastavení:
     - Klikněte na přidaný repozitář
     - Najděte sekci "Version" nebo "Branch"
     - Vyberte branch: `claude/doom-game-hacs-integration-011CV3d8zmxXfsBh4zfcQXCz`
6. Klikněte **ADD**
7. Najděte "DOOM Card" v seznamu
8. Klikněte **INSTALL**
9. **Restartujte Home Assistant**

### Přidání karty do dashboardu

#### YAML mód:
```yaml
type: custom:doom-card
```

#### UI mód:
1. Upravte dashboard
2. Klikněte "Přidat kartu"
3. Vyhledejte "DOOM Card"
4. Přidejte na dashboard

---

## 🇬🇧 English

### Adding to HACS

1. Open **HACS** in Home Assistant
2. Click on **Frontend** (Lovelace)
3. Click **⋮** (three dots) in the top right corner
4. Select **Custom repositories**
5. Fill in:
   - **Repository**: `https://github.com/joshuaaaaa/DOOM`
   - **Category**: `Lovelace`
   - ⚠️ **IMPORTANT**: After adding the repository, select the correct branch in settings:
     - Click on the added repository
     - Find the "Version" or "Branch" section
     - Select branch: `claude/doom-game-hacs-integration-011CV3d8zmxXfsBh4zfcQXCz`
6. Click **ADD**
7. Find "DOOM Card" in the list
8. Click **INSTALL**
9. **Restart Home Assistant**

### Adding card to dashboard

#### YAML mode:
```yaml
type: custom:doom-card
```

#### UI mode:
1. Edit dashboard
2. Click "Add Card"
3. Search for "DOOM Card"
4. Add to dashboard

---

## Troubleshooting / Řešení problémů

### HACS nevidí kartu / HACS doesn't see the card

**Problém:** HACS říká "No modules/cards found"

**Řešení:**
1. Zkontrolujte že jste vybrali správný **branch** v nastavení repository
2. Branch musí být: `claude/doom-game-hacs-integration-011CV3d8zmxXfsBh4zfcQXCz`
3. Zkuste **Redownload** v HACS menu
4. Restartujte Home Assistant

### Karta se nezobrazuje / Card doesn't show

**Problém:** Po instalaci karty se nezobrazuje

**Řešení:**
1. Vymažte **cache prohlížeče** (Ctrl+Shift+R)
2. Zkontrolujte **konzoli prohlížeče** (F12) na chyby
3. Ověřte že soubor existuje: `/local/community/doom-card/doom-card.js`
4. Restartujte Home Assistant

### Chyba 404 při načítání

**Problém:** Console shows 404 error for doom-card.js

**Řešení:**
1. Zkontrolujte že HACS stáhnul soubory do správného adresáře
2. Adresář by měl být: `config/www/community/doom-card/`
3. Zkontrolujte že `doom-card.js` existuje v tomto adresáři
4. Pokud ne, zkuste **Redownload** v HACS

---

## Poznámky / Notes

- ⚠️ Tato verze je ve **vývojové větvi** (development branch)
- Pro stabilní verzi počkejte na merge do main branch
- Všechny funkce jsou plně funkční a testované
- Pro podporu otevřete issue na GitHub

---

**Made with ❤️ for Home Assistant community**
