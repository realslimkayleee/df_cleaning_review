# DF Cleaning Website

Welcome to the new static website for **DF Cleaning**! 

This website has been rebuilt from the ground up using modern CSS (Vanilla CSS, custom design tokens, logical properties, responsive layout) and structured HTML.

## Collaboration & Team Setup
This repo is set up for collaborative development. Here is the division of work:
* **You**: Home Page (`index.html`) & About Us (`about.html`)
* **Kaylee**: Services (`services.html`), Gallery (`gallery.html`), and Get Estimate (`estimate.html`)

## Project Structure
```text
DF-Cleaning/
├── index.html          # Home Page
├── about.html          # About Us Page
├── services.html       # Services Page
├── gallery.html        # Gallery Page
├── estimate.html       # Get Estimate Page
├── css/
│   └── style.css       # Core styling & Design tokens
├── js/
│   └── main.js        # Navigation interactions (mobile menu & dropdowns)
└── assets/             # Images, SVGs, and other media
```

## Running Locally
To test and view your changes in real-time, you can run a simple local HTTP server.

### Option A: Using Python (built-in on most Macs)
Run this command from inside the `DF-Cleaning` folder:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.

### Option B: Using VS Code Live Server
If you use VS Code, install the **Live Server** extension, open the project folder, and click the **Go Live** button in the bottom status bar.

---

## Pushing to GitHub
To publish this repository to GitHub so that Kaylee and you can work on it together:

1. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com) and log in.
   - Click **New** to create a new repository.
   - Name it exactly **`DF-Cleaning`**.
   - Keep it Public/Private as you prefer, and do **NOT** initialize it with a README, `.gitignore`, or license (since we have already created them here).
   - Click **Create repository**.

2. **Link this local folder to your remote repository**:
   Open a terminal, navigate to this folder (`DF-Cleaning`), and run the following commands:
   ```bash
   # Add remote origin
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/DF-Cleaning.git
   
   # Rename default branch to main
   git branch -M main
   
   # Push files to main branch
   git push -u origin main
   ```
   *(Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username).*
