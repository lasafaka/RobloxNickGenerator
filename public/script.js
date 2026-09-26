const cleanParts = [
    "Rizo", "Vexo", "Ziro", "Kiro", "Nexo",
    "Viro", "Zeno", "Rexo", "Kavo", "Zavo",
    "Rivo", "Niro", "Xeno", "Vano", "Zaro"
];

const shortParts = [
    "Rizo", "Vexo", "Ziro", "Kiro", "Nexo",
    "Viro", "Zeno", "Rexo"
];

const gamingParts = [
    "Rizo", "Vexo", "Ziro", "Kiro", "Nexo",
    "Vyn", "Zyn", "Rex", "Vex", "Zex"
];

const vfxParts = [
    "Vexo", "Rizo", "Vyn", "Vfxo",
    "Rexo", "Zyn", "Viro", "Xeno"
];

const endings = [
    "x", "z", "v", "r", "n",
    "fx", "vx", "zx", "ix", "ex"
];

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function makeName(style, length) {

    let name = "";

    if (style === "clean") {

        name = randomItem(cleanParts);

    } else if (style === "short") {

        name = randomItem(shortParts);

    } else if (style === "gaming") {

        name = randomItem(gamingParts) + randomItem(endings);

    } else if (style === "vfx") {

        name = randomItem(vfxParts) + randomItem(["fx", "vfx", "x"]);

    } else {

        const styles = [
            "clean",
            "short",
            "gaming",
            "vfx"
        ];

        return makeName(randomItem(styles), length);
    }

    // Jeżeli nick jest za długi, skracamy go.
    name = name.substring(0, length);

    // Jeżeli jest za krótki, dodajemy litery.
    while (name.length < length) {
        name += randomItem(["x", "z", "v"]);
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
}


async function checkNick(username) {

    try {

        const response = await fetch(
            `/api/check?username=${encodeURIComponent(username)}`
        );

        if (!response.ok) {
            throw new Error("Błąd serwera");
        }

        return await response.json();

    } catch (error) {

        console.error(error);

        return {
            code: -1
        };
    }
}


async function generateNames() {

    const style =
        document.getElementById("style").value;

    const length =
        Number(document.getElementById("length").value);

    const amount =
        Number(document.getElementById("amount").value);

    const results =
        document.getElementById("results");

    results.innerHTML = `
        <div class="loading">
            🔎 Szukam dostępnych nicków...
        </div>
    `;

    const available = new Set();
    const checked = new Set();

    let attempts = 0;

    const maxAttempts = amount * 50;


    while (
        available.size < amount &&
        attempts < maxAttempts
    ) {

        attempts++;

        const nick = makeName(style, length);

        if (checked.has(nick)) {
            continue;
        }

        checked.add(nick);

        const data = await checkNick(nick);


        if (data.code === 0) {

            available.add(nick);

            results.innerHTML = `
                <div class="loading">
                    🔎 Znaleziono
                    ${available.size}/${amount}
                    dostępnych nicków...
                </div>
            `;

        } else if (data.code === -1) {

            results.innerHTML = `
                <div class="loading">
                    ⚠️ Nie udało się połączyć
                    ze sprawdzarką Roblox.
                </div>
            `;

            return;
        }
    }


    results.innerHTML = "";


    if (available.size === 0) {

        results.innerHTML = `
            <div class="loading">
                ❌ Nie znaleziono dostępnych nicków.
            </div>
        `;

        return;
    }


    available.forEach(nick => {

        const div =
            document.createElement("div");

        div.className = "nick";

        div.innerHTML = `
            <div class="nick-name">
                ${nick}
            </div>

            <div class="status available">
                🟢 DOSTĘPNY
            </div>

            <button class="copy">
                KOPIUJ
            </button>
        `;


        div.querySelector(".copy").onclick = () => {

            navigator.clipboard.writeText(nick);

            const button =
                div.querySelector(".copy");

            button.textContent =
                "SKOPIOWANO!";

            setTimeout(() => {

                button.textContent =
                    "KOPIUJ";

            }, 1000);
        };


        results.appendChild(div);

    });

}