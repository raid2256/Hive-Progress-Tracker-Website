const REPO_OWNER = "hive-tracker";
const REPO_NAME = "Hive-Progress-Tracker-Website";

async function createIssue(username) {
  await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify({
      title: `FETCH:${username}`,
      body: `Generate stats for ${username}`
    })
  });
}

async function waitForStats(username) {
  for (let i = 0; i < 20; i++) {
    const res = await fetch(`data/${username}.json?cacheBust=${Date.now()}`);
    if (res.ok) return await res.json();
    await new Promise(r => setTimeout(r, 3000));
  }
  return null;
}

async function loadStats() {
  const user = document.getElementById("username").value;
  if (!user) return;

  document.getElementById("results").innerHTML = "<p>Loading...</p>";

  await createIssue(user);
  const data = await waitForStats(user);

  if (!data) {
    document.getElementById("results").innerHTML = "<p>User not found or API slow.</p>";
    return;
  }

  const container = document.getElementById("results");
  container.innerHTML = "";

  for (const mode in data) {
    const stats = data[mode];
    if (!stats) continue;

    const xp = stats.xp || 0;

    container.innerHTML += `
      <div class="card">
        <h2>${mode}</h2>
        <p>XP: ${xp.toLocaleString()}</p>
      </div>
    `;
  }
}
