export default async function handler(req, res) {

    const username = req.query.username;

    if (!username) {

        return res.status(400).json({
            code: -1,
            error: "Brak nicku"
        });

    }

    try {

        const url =
            "https://auth.roblox.com/v1/usernames/validate" +
            "?request.username=" +
            encodeURIComponent(username) +
            "&request.birthday=2000-01-01" +
            "&request.context=Signup";

        const response =
            await fetch(url);

        const data =
            await response.json();

        return res.status(200).json(data);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            code: -1,
            error: "Błąd połączenia"
        });

    }
}