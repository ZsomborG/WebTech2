# Könyvtár Kezelő Rendszer - Web technológiák 2

Készítette: Tóth Zsombor Gábor, D0H157

Modern, teljes értékű webalkalmazás könyvtári nyilvántartások kezelésére. A projekt egy kliens-szerver architektúrájú (MERN-szerű, de modernizált) alkalmazás, amely lehetőséget biztosít a könyvek böngészésére, kölcsönzésére, valamint adminisztrátori jogosultsággal a könyvkészlet teljes körű kezelésére (CRUD).

## Főbb Funkciók  
- **Felhasználói hitelesítés:** JWT (JSON Web Token) alapú bejelentkezés és regisztráció.
- **Szerepkörök (Role-based access):**
  - *Felhasználó (User):* Böngészheti a könyveket, szűrhet, és kölcsönözhet/visszavihet könyveket.
  - *Admin:* Hozzáfér a teljes rendszerhez, új könyveket adhat hozzá, módosíthatja vagy törölheti a meglévőket. (Demó célból a felületen gombnyomásra váltható a szerepkör).
- **Interaktív Dashboard:** Valós idejű statisztikák, kölcsönzési adatok, valamint műfaj és kiadási év alapján generált diagramok (Recharts).
- **Fejlett Könyv Kereső:** Keresés, szűrés (műfaj szerint), rendezés (cím, dátum, mennyiség szerint) és lapozás.
- **Kölcsönzési rendszer:** Készletnyilvántartás, aktív és lejárt kölcsönzések figyelése.
- **Reszponzív, modern UI:** Tailwind CSS v4, Base UI (Shadcn) és Framer Motion animációk biztosítják a minőségi felhasználói élményt.

## Technológiai Stack

**Frontend (`/client`):**
- React 19, TypeScript, Vite
- Tailwind CSS v4, Base UI / Shadcn UI komponensek
- TanStack Query (React Query) v5
- React Hook Form + Zod
- Recharts, Framer Motion

**Backend (`/server`):**
- Node.js & Express.js (v5), TypeScript
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Zod, Bcrypt.js
##  Telepítés és Indítás
### Előfeltételek
- [Node.js](https://nodejs.org/) (v18 vagy újabb ajánlott)
- **Helyi MongoDB adatbázis** (A projekt alapértelmezetten lokális adatbázist használ, online csatlakozás nincs beállítva).

### 1. MongoDB elindítása lokálisan

[MongoDB Community Server](https://www.mongodb.com/try/download/community)-t. Telepítés után a MongoDB szolgáltatás automatikusan elindul a háttérben a 27017-es porton.

### 2. Projekt klónozása és függőségek telepítése

Mivel a projekt két különálló (client és server) részből áll, mindkét helyen telepíteni kell a csomagokat. Nyiss egy terminált a projekt gyökerében:  

```bash
# Backend függőségek telepítése
cd server
npm install
```

```bash
# Frontend függőségek telepítése
cd client
npm install
```  

### 3. Környezeti változók (.env) beállítása

A `server` mappában hozz létre egy `.env` fájlt az alábbi tartalommal:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_system
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

A `client` mappában lévő `.env` fájl tartalma:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Adatbázis feltöltése tesztadatokkal (Seeding)

A backend tartalmaz egy seed szkriptet, ami feltölti a lokális adatbázist könyvekkel, teszt felhasználókkal és kölcsönzésekkel, így azonnal kipróbálható a rendszer.

```bash
cd server
npm run seed
```

**Fontos:** A seedelés létrehoz egy admin felhasználót az alábbi adatokkal:

- **Felhasználónév:** `admin`
- **Jelszó:** `password`

### 5. Fejlesztői szerverek indítása

A projekt gyökérkönyvtárából (`WebTech2` mappa) elindíthatod mindkét szervert külön terminál ablakban:

**Backend indítása:**
```bash
npm run dev:server
```

**Frontend indítása:**
```bash
npm run dev:client
```

Az alkalmazás ezután elérhető lesz a böngészőben a [http://localhost:5173](http://localhost:5173) címen, a backend API pedig a `http://localhost:5000` címen fut.
