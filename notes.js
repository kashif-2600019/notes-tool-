const fs = require("fs");

const file = "notes.json";
const command = process.argv[2];
const text = process.argv[3];

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

let notes = loadNotes();

if (command === "add")
{
    if (!text)
    {
        console.log("Please enter a note.");
    }
    else
    {
        notes.push(text);
        saveNotes(notes);
        console.log("Note added.");
    }
}
else if (command === "list")
{
    if (notes.length === 0)
    {
        console.log("No notes found.");
    }
    else
    {
        notes.forEach((note, index) =>
        {
            console.log((index + 1) + ". " + note);
        });
    }
}
else if (command === "clear")
{
    saveNotes([]);
    console.log("All notes cleared.");
}
else
{
    console.log("Wrong command. Use add, list or clear.");
}
