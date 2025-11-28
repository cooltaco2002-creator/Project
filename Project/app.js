async function fetchFish() {
	const res = await fetch('/api/fish?sort=length_desc');
	const data = await res.json();
	const container = document.getElementById('fish-list');
	if (!container) return;
	container.innerHTML = '';
	data.forEach((f) => {
		const li = document.createElement('li');
		li.textContent = `${f.common_name} (${f.scientific_name}) - ${f.average_length_cm} cm [${f.habitat}]`;
		container.appendChild(li);
	});
}

async function fetchSummary() {
	const res = await fetch('/api/fish/summary');
	const data = await res.json();
	const container = document.getElementById('fish-summary');
	if (!container) return;
	container.innerHTML = '';
	data.forEach((row) => {
		const li = document.createElement('li');
		li.textContent = `${row.habitat}: ${row.species_count} species, avg length ${Math.round(row.avg_length)} cm`;
		container.appendChild(li);
	});
}

async function fetchUsersWithFish() {
	const res = await fetch('/api/users-with-fish');
	const data = await res.json();
	const container = document.getElementById('users-with-fish');
	if (!container) return;
	container.innerHTML = '';
	data.forEach((row) => {
		const li = document.createElement('li');
		li.textContent = `${row.username} → ${row.common_name} (${row.scientific_name}) in ${row.habitat}`;
		container.appendChild(li);
	});
}

// Handle form input to populate fishdata
document.addEventListener('DOMContentLoaded', () => {
	fetchFish();
	fetchSummary();
	fetchUsersWithFish();

	const form = document.getElementById('fish-form');
	if (form) {
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			const common_name = form.common_name.value.trim();
			const scientific_name = form.scientific_name.value.trim();
			const average_length_cm = parseInt(form.average_length_cm.value, 10);
			const habitat = form.habitat.value.trim();
			const res = await fetch('/api/fish', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ common_name, scientific_name, average_length_cm, habitat })
			});
			const result = await res.json();
			if (res.ok) {
				form.reset();
				fetchFish();
				fetchSummary();
			} else {
				alert(result.error || 'Error creating fish');
			}
		});
	}
});
