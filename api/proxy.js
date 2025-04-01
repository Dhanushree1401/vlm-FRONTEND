export default async function handler(req, res) {
    const response = await fetch("http://0.0.0.0:7860/classify-image", {
        method: req.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.BACKEND_API_KEY}`, // Add API Key if required
        },
        body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
}
