async function loadStats() {
  const user = document.getElementById("username").value;
  if (!user) return;

  document.getElementById("results").innerHTML = "Loading...";

  const res = await fetch(`https://api.playhive.com/v0/game/all/all/${user}`);

  if (!res.ok) {
    document.getElementById("results").innerHTML = "User not found.";
    return;
  }

  const data = await res.json();

  let html = "";
  for (const mode in data) {
    const xp = data[mode]?.xp || 0;
    html += `
      <div class="card">
        <h2>${mode}</h2>
        <p>XP: ${xp}</p>
      </div>
    `;
  }

  document.getElementById("results").innerHTML = html;
}
