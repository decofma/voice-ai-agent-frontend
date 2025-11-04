### 2. Frontend README (`frontend/README.md`)
![AI Voice Agent](https://iili.io/KQWX8Ku.png) 

```md
# Frontend: AI Voice Agent Admin Panel (Next.js)

This directory contains the admin UI for the project, built in Next.js and TypeScript.

It allows the administrator to:
1.  Configure and register new AI Agents (saving the configuration via the backend).
2.  Initiate test "Web Calls" in the browser.
3.  View a list of past calls and their structured results.

## Tech Stack

* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** CSS Modules (No Tailwind dependencies)
* **Voice SDK:** `retell-client-js-sdk` (V1)

## 1. Setup

### Prerequisites
* Node.js (v18+) and npm

### Installation

1.  **Navigate to the `frontend/` folder:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *(This will install React, Next.js, and the `retell-client-js-sdk`)*

## 2. Execution

1.  **Start the development server:**
    ```bash
    npm run dev
    ```

2.  **Access the application:**
    Open your browser to `http://localhost:3000`.

### Backend Communication (Proxy)

This frontend does **not** call the FastAPI backend (on port 8000) directly. It uses the built-in Next.js proxy (`rewrites`) to avoid CORS errors.

**File (`frontend/next.config.mjs`):**
```javascript
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', // Any frontend fetch to /api/v1...
        destination: 'http://localhost:8000/api/v1/:path*', // ...is proxied to the backend
      },
    ];
  },
};
```

**  Note: This ensures that all application logic (starting calls, fetching results) is handled seamlessly.