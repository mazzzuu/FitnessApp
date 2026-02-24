1. Introduzione

**FitnessTracker** è un'applicazione web full stack progettata per aiutare gli utenti a monitorare le proprie attività fisiche quotidiane, visualizzare schede di allenamento personalizzate e analizzare l'andamento dei progressi nel tempo.  
L'applicazione è composta da un frontend React (TypeScript) e un backend Node.js/Express con database SQLite.

## 2. Obiettivi

- Fornire un'interfaccia intuitiva per il tracciamento di passi, calorie e ore in piedi.
- Mostrare schede di allenamento con dettagli (durata, calorie stimate, livello, gruppo muscolare).
- Consentire la visualizzazione degli esercizi associati a ciascuna scheda.
- Offrire analisi storiche tramite grafici.
- Gestire l'autenticazione degli utenti e la persistenza della sessione.
- Realizzare un'applicazione modulare, facilmente estendibile e mantenibile.

## 3. Tecnologie utilizzate

### Backend
- **Node.js** con framework **Express** per la creazione delle API REST.
- **SQLite3** come database leggero e embedded, ideale per prototipi e applicazioni di piccola scala.
- **CORS** e **body-parser** come middleware per gestire richieste cross-origin e parsing del body.
- Architettura semplice con route organizzate per risorsa (users, activities, workout-plans).

### Frontend
- **React** (con hook `useState`, `useEffect`) per la gestione della UI e dello stato locale.
- **TypeScript** per una maggiore robustezza del codice e una migliore esperienza di sviluppo.
- **Axios** per le chiamate HTTP verso il backend.
- **Tailwind CSS** per uno styling rapido, utility-first e responsive.
- **Recharts** (opzionale) per la generazione di grafici interattivi.
- **localStorage** per mantenere la sessione utente tra i refresh.

## 4. Architettura del sistema

L'applicazione segue un'architettura client-server classica:

- Il **client** (frontend React) si occupa dell'interfaccia utente e della logica di presentazione. Comunica con il backend tramite chiamate AJAX (Axios) verso le API REST.
- Il **server** (backend Express) espone le API, interroga il database SQLite e restituisce i dati in formato JSON.

Il flusso dei dati è unidirezionale:
1. L'utente interagisce con la UI.
2. Il frontend invia una richiesta HTTP al backend.
3. Il backend elabora la richiesta, accede al database e restituisce una risposta.
4. Il frontend aggiorna lo stato e re-renderizza i componenti.

## 5. Backend: API e database

### 5.1 Endpoint implementati

| Metodo | Endpoint                           | Descrizione                                         |
|--------|------------------------------------|-----------------------------------------------------|
| GET    | `/api/users`                       | Restituisce tutti gli utenti                        |
| GET    | `/api/users/:id`                   | Restituisce un singolo utente per ID                |
| POST   | `/api/login`                        | Autentica un utente (email/password)                |
| GET    | `/api/activities/user/:userId`      | Attività giornaliere di un utente                   |
| POST   | `/api/activities`                    | Aggiunge una nuova attività                          |
| GET    | `/api/workout-plans`                 | Elenco schede (filtrabile per level/muscle_group)   |
| GET    | `/api/workout-plans/:id/exercises`   | Esercizi di una scheda specifica                     |

### 5.2 Database

Il database SQLite contiene le seguenti tabelle:
- `users`: informazioni utente e goal giornalieri.
- `daily_activities`: tracciamento giornaliero di passi, calorie, ore in piedi, distanza.
- `workout_plans`: schede di allenamento.
- `exercises`: elenco degli esercizi.
- `workout_plan_exercises`: relazione molti-a-molti tra schede ed esercizi, con dettagli su serie, ripetizioni e durata.

Le relazioni sono gestite tramite chiavi esterne.

### 5.3 Sicurezza

Nell'implementazione attuale la password è salvata in chiaro (`password_hash`). In un contesto di produzione sarebbe necessario utilizzare un algoritmo di hashing (es. bcrypt) per garantire la sicurezza delle credenziali.

## 6. Frontend: componenti e funzionalità

### 6.1 Struttura dei componenti

- **`App.tsx`**: componente principale che gestisce lo stato globale (utente, attività, schede, loading, errori). Contiene la logica di autenticazione, fetching dati e callback. Mostra condizionalmente la schermata di login o la dashboard.
- **`Login`**: componente per l'inserimento di email e password; invia la richiesta di login e, in caso di successo, passa i dati dell'utente ad `App`.
- **`ActivityCharts`**: visualizza grafici (linee/barre) basati sui dati storici delle attività.
- **`StepsAnalytics`**: analisi dettagliata dei passi (ad esempio media, trend).
- **`WorkoutDetail`**: modale che mostra gli esercizi di una scheda selezionata, con serie, ripetizioni e recupero.

### 6.2 Flusso di autenticazione

1. All'avvio, `App` verifica la presenza di un utente in `localStorage`. Se presente, imposta lo stato `user` e carica i dati associati.
2. Altrimenti, mostra il componente `Login`.
3. Dopo il login, i dati dell'utente vengono salvati in `localStorage` e caricati i dati dell'utente (attività e schede).

### 6.3 Caricamento dei dati

La funzione `loadUserData` effettua due chiamate parallele:
- `getUserActivities` per ottenere le attività giornaliere.
- `getWorkoutPlans` per ottenere le schede di allenamento.

Durante il caricamento viene mostrato uno spinner; in caso di errore viene visualizzato un messaggio.

### 6.4 Visualizzazione delle schede allenamento

Le schede vengono mostrate in una griglia di card. Ogni card contiene:
- Nome, livello (con colore corrispondente), gruppo muscolare.
- Durata e calorie stimate.
- Pulsante "Visualizza Allenamento" che recupera gli esercizi associati e apre il modale `WorkoutDetail`.

### 6.5 Statistiche giornaliere

Le tre card (passi, calorie, ore in piedi) mostrano il progresso rispetto all'obiettivo giornaliero tramite barre di avanzamento. Il colore della barra cambia quando l'obiettivo è stato raggiunto.

### 6.6 Storico attività

Le ultime 5 attività sono elencate con dettaglio di data, passi, calorie e ore in piedi.

### 6.7 Grafici

Due pulsanti nell'header permettono di mostrare/nascondere i componenti grafici, che ricevono i dati storici (`activities`) come props. L'implementazione effettiva dei grafici è demandata a Recharts (non incluso di default, ma consigliato).

## 7. Gestione degli errori e loading

- Durante il caricamento dei dati, viene mostrato un indicatore circolare.
- In caso di errore nelle chiamate API, un messaggio di errore appare in un box rosso.
- Se il login fallisce, il componente `Login` mostra un messaggio di errore.

## 8. Punti di forza

- **Tipizzazione forte** con TypeScript riduce errori a runtime e migliora la manutenibilità.
- **Separazione delle responsabilità**: componenti chiari e focalizzati.
- **Persistenza della sessione** tramite `localStorage`.
- **Design responsive** grazie a Tailwind CSS.
- **Feedback visivo** immediato con barre di progresso e messaggi di errore.
- **API ben definite** e facilmente estendibili.

## 9. Possibili miglioramenti futuri

- Implementare l'hashing delle password (bcrypt).
- Aggiungere test unitari e di integrazione (Jest, React Testing Library, Supertest per le API).
- Introdurre una gestione dello stato più globale (Context API o Redux) per evitare il prop drilling.
- Consentire all'utente di inserire manualmente nuove attività.
- Filtrare le schede di allenamento per livello/gruppo muscolare direttamente nell'interfaccia.
- Aggiungere autenticazione tramite JWT con token bearer.
- Internazionalizzazione (i18n) per supportare più lingue.
- Migliorare la validazione dei dati in ingresso sulle API.

## 10. Conclusioni

Il progetto FitnessTracker rappresenta un'applicazione completa e funzionante che copre le esigenze di base di un fitness tracker personale. L'architettura modulare e l'uso di TypeScript pongono solide basi per futuri sviluppi e miglioramenti. La combinazione di un frontend moderno e reattivo con un backend leggero ma efficace rende l'applicazione facilmente deployabile e utilizzabile.

---

**Data**: Febbraio 2026