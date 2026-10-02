# bnp-szp-wplatomat

Strona szybkiej wpłaty dla Szlachetnej Paczki (płatności Axepta BNP Paribas / BLIK).
Statyczny szablon HTML — bez frameworka, bez Bootstrapa.

## Stack

| Narzędzie | Wersja | Do czego |
|---|---|---|
| [Vite](https://vite.dev/) | 8 | serwer deweloperski i build |
| [Sass](https://sass-lang.com/) (Dart Sass) | 1.x | style w SCSS (moduły `@use`) |
| [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) | 2.x | opcjonalny build do jednego pliku HTML |

- JavaScript: czysty JS (`src/js/main.js`), bez zależności.
- Czcionki: Google Fonts (Poppins, Barlow Condensed).
- Wymagany Node.js 20.19+ lub 22.12+.

## Komendy

```bash
npm install            # instalacja zależności
npm run dev            # serwer deweloperski z podglądem na żywo (http://localhost:5173)
npm run build          # build produkcyjny do dist/
npm run build:single   # wszystko w jednym pliku: dist-single/index.html
npm run preview        # podgląd zbudowanego dist/ (http://localhost:4173)
```

W trybie `dev` SCSS jest kompilowany w locie — pliki CSS powstają dopiero po `npm run build`.

## Wynik buildu

`npm run build` → `dist/` (to wrzucamy na serwer):

```
dist/
├── index.html
├── css/style.css   # skompilowany i zminifikowany SCSS
├── js/main.js
└── images/         # obrazki z oryginalnymi nazwami
```

`npm run build:single` → `dist-single/index.html` — CSS, JS i obrazki wbudowane w jeden plik
(przydatne, gdy stronę trzeba wkleić / wgrać jako pojedynczy plik).

## Struktura

```
index.html
vite.config.js
src/
├── images/
├── js/main.js
└── scss/
    ├── main.scss          # punkt wejścia — kolejność importów = kolejność kaskady
    ├── vendor/            # minimalny wycinek Bootstrap 4.3.1 (reboot + 4 klasy siatki)
    ├── abstracts/         # tokeny (zmienne CSS) i zmienne Sass (breakpointy)
    ├── base/
    ├── layout/            # topbar, hero, mobile-top, footer
    ├── components/        # karta płatności, kwoty, metody płatności, pola, przycisk
    └── _responsive.scss   # media queries
```
