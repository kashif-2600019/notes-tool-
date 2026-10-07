const http = require("http");
const fs = require("fs");

const port = 3000;
const file = "notes.json";

function loadNotes()
{
    if (!fs.existsSync(file))
    {
        return [];
    }

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveNotes(notes)
{
    fs.writeFileSync(file, JSON.stringify(notes, null, 2));
}

const server = http.createServer((req, res) =>
{
    if (req.method === "GET" && req.url === "/")
    {
        res.setHeader("Content-Type", "text/html");
        res.end(fs.readFileSync("index.html"));
        return;
    }

    if (req.method === "GET" && req.url === "/style.css")
    {
        res.setHeader("Content-Type", "text/css");
        res.end(fs.readFileSync("style.css"));
        return;
    }

    if (req.method === "GET" && req.url === "/script.js")
    {
        res.setHeader("Content-Type", "application/javascript");
        res.end(fs.readFileSync("script.js"));
        return;
    }

    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/notes")
    {
        res.writeHead(200);
        res.end(JSON.stringify(loadNotes()));
    }
    else if (req.method === "POST" && req.url === "/notes")
    {
        let body = "";

        req.on("data", chunk =>
        {
            body += chunk;
        });

        req.on("end", () =>
        {
            const data = JSON.parse(body);

            if (!data.text)
            {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Note is required" }));
                return;
            }

            const notes = loadNotes();
            notes.push(data.text);
            saveNotes(notes);

            res.writeHead(201);
            res.end(JSON.stringify({ message: "Note added" }));
        });
    }
    else if (req.method === "DELETE" && req.url === "/notes")
    {
        saveNotes([]);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "All notes cleared" }));
    }
    else
    {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Not found" }));
    }
});

server.listen(port, () =>
{
    console.log("Server running at http://localhost:" + port);
});
