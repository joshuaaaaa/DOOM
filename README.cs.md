# DOOM Card pro Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)

Retro DOOM-styl first-person shooter hra jako Lovelace karta pro Home Assistant! Zažijte klasický 3D ray-casting gameplay přímo ve vašem HA dashboardu.

## Funkce

- 🎮 **Plnohodnotný 3D Ray-Casting Engine** - Klasické DOOM-style vykreslování
- 🔫 **Více zbraní** - Pistole, Brokovnice a Kulomet
- 👾 **Inteligentní nepřátelé** - AI nepřátelé, kteří vás pronásledují a útočí
- 🗺️ **Progresivní obtížnost** - Více nepřátel s každou úrovní
- 🎵 **Retro Zvukové Efekty** - Syntetizované zvuky zbraní
- ⌨️ **IJKL Ovládání** - Klasické klávesové ovládání s podporou myši
- 📊 **HUD Displej** - Sledování zdraví, munice, zbraně a úrovně
- 🎯 **Zaměřovač** - Přesný zaměřovací systém
- 💥 **Částicové Efekty** - Krev a exploze

## Instalace

### HACS (Doporučeno)

⚠️ **DŮLEŽITÉ**: Tento repozitář je aktuálně na vývojové větvi. Postupujte podle těchto kroků:

1. Otevřete HACS ve vašem Home Assistant
2. Klikněte na "Frontend"
3. Klikněte na tři tečky v pravém horním rohu
4. Vyberte "Custom repositories"
5. Přidejte URL tohoto repozitáře: `https://github.com/joshuaaaaa/DOOM`
6. Vyberte kategorii: "Lovelace"
7. Klikněte "PŘIDAT"
8. **Po přidání** klikněte na repozitář a vyberte větev: `claude/doom-game-hacs-integration-011CV3d8zmxXfsBh4zfcQXCz`
9. Najděte "DOOM Card" v seznamu a klikněte "INSTALOVAT"
10. Restartujte Home Assistant

📖 **Detailní návod**: Viz [HACS_INSTALLATION.md](HACS_INSTALLATION.md) pro řešení problémů a více detailů.

### Manuální Instalace

1. Stáhněte `doom-card.js` z tohoto repozitáře
2. Zkopírujte ho do vašeho adresáře `config/www/`
3. Přidejte následující do vašich Lovelace resources:

```yaml
resources:
  - url: /local/doom-card.js
    type: module
```

4. Restartujte Home Assistant

## Konfigurace

Přidejte kartu do vašeho Lovelace dashboardu:

### UI Mód

1. Upravte váš dashboard
2. Klikněte "Přidat Kartu"
3. Vyhledejte "DOOM Card"
4. Klikněte pro přidání

### YAML Mód

```yaml
type: custom:doom-card
```

To je vše! Žádná další konfigurace není potřeba.

## Ovládání

### Klávesnice

- **I** - Pohyb vpřed
- **K** - Pohyb vzad
- **J** - Otočit vlevo
- **L** - Otočit vpravo
- **Mezerník** - Střelba
- **1** - Přepnout na Pistoli (neomezená munice)
- **2** - Přepnout na Brokovnici (24 nábojů)
- **3** - Přepnout na Kulomet (100 nábojů)
- **ESC** - Pauza

### Myš

**Důležité:** Klikněte na herní canvas pro aktivaci ovládání myší (uzamčení kurzoru)

- **Pohyb Myši** - Rozhlížení (po kliknutí na canvas)
- **Levé Tlačítko** - Střelba (první klik aktivuje myš, další klik střílí)
- **Pravé Tlačítko** - Přepínání zbraní (další zbraň)
- **Kolečko Nahoru** - Předchozí zbraň
- **Kolečko Dolů** - Další zbraň

💡 **Tip:** První kliknutí na canvas uzamkne váš kurzor. Klikněte znovu pro střelbu!

## Hratelnost

### Cíl

Přežijte vlny nepřátel napříč více úrovněmi. Každá úroveň zvyšuje obtížnost s více nepřáteli a vyšším zdravím.

### Zbraně

1. **Pistole**
   - Poškození: 15
   - Munice: Neomezená
   - Rychlost střelby: Střední
   - Nejlepší pro: Začínající zbraň, šetření municí

2. **Brokovnice**
   - Poškození: 45
   - Munice: 24 (na začátku)
   - Rychlost střelby: Pomalá
   - Nejlepší pro: Vysoké poškození jedním výstřelem

3. **Kulomet**
   - Poškození: 20
   - Munice: 100 (na začátku)
   - Rychlost střelby: Velmi rychlá
   - Nejlepší pro: Nepřetržitá palba, více nepřátel

### Nepřátelé

- **Zelení** - Nečinní/Hlídkující
- **Žlutí** - Pronásledují hráče
- **Červení** - Útočí na hráče

Nepřátelé vás detekují, když jste v dosahu, a pronásledují vás. Pokud se přiblíží dostatečně blízko, zaútočí a poškodí vaše zdraví.

### Tipy

- Pořád se pohybujte! Stání na místě z vás dělá snadný cíl
- Používejte zdi jako kryt
- Přepínejte zbraně podle situace
- Sledujte svou munici - pistole má neomezenou, ale nižší poškození
- Každý zabitý nepřítel vám dá 100 × úroveň bodů
- Zabijte všechny nepřátele pro postup na další úroveň

## Kompatibilita Prohlížečů

Testováno a funguje na:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Vyžaduje:
- Podporu Web Audio API
- Canvas 2D rendering
- Pointer Lock API (pro rozhlížení myší)

## Výkon

Hra používá efektivní ray-casting rendering a měla by běžet plynule na většině moderních zařízení. Pokud zaznamenáváte zpomalení:

- Zavřete ostatní karty prohlížeče
- Zmenšete okno prohlížeče
- Použijte méně náročný Home Assistant theme

## Řešení Problémů

### Karta se nezobrazuje

1. Vymažte cache prohlížeče
2. Zkontrolujte konzoli prohlížeče na chyby
3. Ověřte, že `doom-card.js` je přístupný na `/local/doom-card.js`
4. Restartujte Home Assistant

### Ovládání nefunguje

1. Ujistěte se, že jste klikli na herní canvas
2. Zkontrolujte, zda je aktivní pointer lock (klikněte na canvas)
3. Zkuste obnovit stránku

### Žádný zvuk

1. Zkontrolujte zásady automatického přehrávání prohlížeče
2. Nejprve interagujte se stránkou (klikněte na tlačítko start)
3. Zkontrolujte nastavení hlasitosti prohlížeče

## Vývoj

Chcete přispět? Jak začít:

```bash
git clone https://github.com/joshuaaaaa/DOOM.git
cd DOOM
# Upravte doom-card.js
# Testujte v Home Assistant
```

## Poděkování

Inspirováno:
- Původní DOOM od id Software (1993)
- Ray-casting technikou od Lode Vandevenne
- Home Assistant komunitou

## Licence

MIT License - viz LICENSE soubor pro detaily

## Podpora

Pokud se vám tato karta líbí, prosím ohodnoťte repozitář hvězdičkou! ⭐

Pro problémy a návrhy funkcí použijte prosím stránku [GitHub Issues](https://github.com/joshuaaaaa/DOOM/issues).

---

**Vytvořeno s ❤️ pro Home Assistant komunitu**
