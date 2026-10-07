async function loadNotes()
{
    const response = await fetch("/notes");
    const notes = await response.json();

    const list = document.getElementById("notesList");
    list.innerHTML = "";

    notes.forEach(note =>
    {
        const item = document.createElement("li");
        item.textContent = note;
        list.appendChild(item);
    });

    document.getElementById("message").textContent = "Notes loaded.";
}

async function addNote()
{
    const input = document.getElementById("noteInput");
    const text = input.value.trim();

    if (!text)
    {
        document.getElementById("message").textContent = "Please enter a note.";
        return;
    }

    const response = await fetch("/notes",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: text })
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message;

    if (response.ok)
    {
        input.value = "";
        loadNotes();
    }
}

async function clearNotes()
{
    const response = await fetch("/notes",
    {
        method: "DELETE"
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message;

    loadNotes();
}

loadNotes();
