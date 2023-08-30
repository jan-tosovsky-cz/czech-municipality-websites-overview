# Detaily obecních webů

## Úvod
Primárním účelem projektu bylo získat hrubý přehled o použitých redakčních systémech (CMS) na webech obcí.

Kvůli absenci oficiálního seznamu obecních webů jsou použity údaje o obcích z Wikidat, kam byly v průběhu testů doplněny chybějící a opraveny zastaralé údaje.

## Procedura
Pomocí skriptů se stáhnou titulní stránky webů a v nich se pak hledají klíčová slova typická pro daný CMS. Procedura je však rozložena mezi další mezikroky.

### 01. Stažení informací z Wikidat
Skript `municipality-raw-data-collector.js` uloží výsledek do souboru `data/municipality-raw-data.json`.

### 02. Zjednodušení struktury dat
Skript `municipality-raw-data-normalizer.js` zjednoduší datovou strukturu a případně opraví situace, kdy je k jedné obci ve Wikidatech definováno více odkazů. Výsledek se uloží do `data/municipality-data.json`.

### 03. Stažení obsahu úvodních stránek
Skript `municipality-website-homepage-content-collector.js` stáhne obsah úvodních stránek do složky `data/municipality-website-homepage-content` s názvem `{ID}.html`, kde `{ID}` je RÚIAN kód obce.

Do logu se vypisují stránky, jejichž načtení selhalo.

Pokud úvodní stránka obsahuje přesměrování pomocí direktivy `<meta http-equiv="refresh" content="0; url={URL}">`, je nutné přidat cílovou URL do speciálního mapování, aby se stáhla reálná stránka.

Při opakovaném spuštění se stahují pouze dosud nestažené stránky. 

### 04. Detekce CMS systémů
Skript `municipality-cms-detector.js` ve staženém obsahu pomocí klíčových slov detekuje definované CMS systémy a výsledné mapování uloží do souboru `data/cms-map.json`.

### 05. Výpis statistiky použitých CMS sytémů
Skript `municipality-cms-statistics.js` seskupí položky, setřídí je dle počtu a vypíše je do ladícího okna.

## Pomůcky

### Hledání klíčových slov ve staženém obsahu
Ve skriptu `keyword-searcher.js` stačí upravit hodnotu FIXME na řádku `const keyword = "FIXME"`. Po spuštění se do ladícího okna vypíší nalezená ID obcí.

### Stažení informací o obcích v JSON formátu
Skript `municipality-data-aggregator.js` sloučí datové soubory do výsledného `data/municipality-aggregated-data.json`.

### Stažení informací o obcích v CSV formátu
Skriptem `municipality-data-csv-exporter.js` lze převést sloučená data do formátu CSV `data/municipality-aggregated-data.csv`.

## Závěry

### Zastoupení CMS

- 15 % webů (z celkových 6250) se nepodařilo přiřadit k žádnému CMS. Je však možné, že některý systém unikl.

- Přes 70 % webů spravují společnosti, které mají specializované produkty pro obce (Galileo, Webhouse, Antee, W Partner, Obce na webu, Public4U).

- 10 % webů běží na open source CMS (z toho 70 % WordPress, 25 % Joomla! a zbylých 5 % Drupal).

- Zbylých 5 % webů používá buď méně známé open source CMS, případně jim web spravují firmy s využitím jejich privátních CMS.

### HTTPS

- Zabezpečený protokol není pravidlem. 

- Nemalé procento webů má chybně nakonfigurovaný certifikát.

## Kuriozity

- 11 obcí nemá vlastní web.
- Minimálně ve 3 případech mají obce nefunkční stránky (místo obsahu se zobrazí chybová hláška).
- Minimálně 2 obce opustily externího dodavatele a daly přednost open source CMS.
