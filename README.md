# 💳 Pangasüsteemi Rakendus

See projekt on **lihtne pangasüsteemi simulatsioon**, mis on tehtud kasutades **Reacti, Node.js-i, Expressi ja SQLite'i**.
Rakendus võimaldab kasutajal näha oma kontojääki, teha rahaülekandeid ning teenida raha väikese **töö-süsteemi** kaudu.

Rakendusel on **tume (black + purple) fintech-stiilis kasutajaliides**, mis meenutab kaasaegseid pangarakendusi. 🌌

---

## ✨ Funktsioonid

### 📊 Konto ülevaade

- Näitab **kontojääki**
- Kuvab **ootel teenitud raha**
- Kuvab **viimaseid tehinguid**

### 💸 Raha saatmine ja väljavõtmine

- Võimalik **raha välja võtta**
- Võimalik **raha sõbrale saata**
- Kõik tehingud ilmuvad **Recent Activity** sektsiooni

### 🛠️ Töö süsteem

- Vajuta **Start Work**, et teenida raha
- Teenitud raha lisatakse kontole **aja möödudes**
- Ootel olev raha kuvatakse **progressiribaga**
- Kui töö saab valmis, lisatakse raha automaatselt kontole

---

## 🧰 Kasutatud tehnoloogiad

**Frontend**

- React ⚛️
- React Router
- Vite

**Backend**

- Node.js
- Express

**Andmebaas**

- SQLite 🗄️

**Disain**

- Custom CSS (dark fintech theme)

---

## 📂 Projekti struktuur

```
banking-system
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
│
├── server
│   ├── src
│   │   ├── db.js
│   │   ├── logic.js
│   │   ├── seed.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Paigaldamine

Klooni projekt:

```
git clone https://github.com/switchkilllegacy/banking-system.git
cd banking-system
```

---

## ▶️ Backend käivitamine

```
cd server
npm install
npm run seed
npm run dev
```

Server käivitub aadressil:

```
http://localhost:5179
```

---

## 💻 Frontend käivitamine

Ava uus terminal ja käivita:

```
cd client
npm install
npm run dev
```

Frontend töötab aadressil:

```
http://localhost:5173
```

Ava see brauseris. 🌐

---

## 🔄 Rakenduse kasutamine

1. Käivita server
2. Käivita frontend
3. Ava rakendus brauseris
4. Vajuta **Work**, et teenida raha 💰
5. Oota kuni töö saab valmis
6. Raha lisatakse automaatselt sinu kontole

---

## 🚀 Võimalikud edasiarendused

- 🔐 Kasutajate sisselogimine
- 📊 Kulutuste graafikud
- 👥 Mitu kasutajat
- 🔔 Reaalajas teavitused
- 📱 Parem mobiilivaade

---

## 🤖 AI märkus

See projekt on loodud **katsetamise ja õppimise eesmärgil** ning on tehtud suuresti **tehisintellekti abiga**.

Projekt ei ole mõeldud päris pangasüsteemina kasutamiseks.
See on isiklik **lõbu- ja õppimisprojekt**, mille eesmärk on uurida, kuidas AI saab aidata tarkvara arendamisel.

Autor tegeles projekti ideede, testimise ja kohandamisega.
