const REPO_OWNER = "YOUR_GITHUB_USERNAME";
const REPO_NAME = "YOUR_REPO_NAME";
const BRANCH = "main";

// XP tables (unchanged)
const LEVEL_TABLES = { /* your tables here */ };
const MODE_NAMES = { /* your mode names here */ };

async function triggerAction(username) {
  await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/search.txt`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GITHUB_TOKEN}`
    },
    body: JSON.stringify({
      message: `Search for ${username}`,
      content: btoa(username),
      branch: BRANCH
    })
  });
}

async function waitForJson(username) {
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

  await triggerAction(user);
  const data = await waitForJson(user);

  if (!data) {
    document.getElementById("results").innerHTML = "<p>User not found or API slow.</p>";
    return;
  }

  const container = document.getElementById("results");
  container.innerHTML = "";

  for (const mode in LEVEL_TABLES) {
    const stats = data[mode];
    if (!stats) continue;

    const xp = stats.xp || 0;
    const level = calculateLevel(mode, xp);
    const max = LEVEL_TABLES[mode].length;

    const prevXP = LEVEL_TABLES[mode][level - 2] || 0;
    const nextXP = LEVEL_TABLES[mode][level - 1] || LEVEL_TABLES[mode][max - 1];

    const progress = ((xp - prevXP) / (nextXP - prevXP)) * 100;

    container.innerHTML += `
      <div class="card">
        <h2>${MODE_NAMES[mode]}</h2>
        <p>Level: ${level} / ${max}</p>
        <p>XP: ${xp.toLocaleString()}</p>
        <div class="progress">
          <div class="progress-bar" style="width:${progress}%"></div>
        </div>
      </div>
    `;
  }
}
