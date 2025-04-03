<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	const reports = [
		{ id: 1, title: 'Bench Press', value: '100 lbs', date: '2024-03-31' },
		{ id: 2, title: 'Pull-ups', value: '12 reps', date: '2024-03-31' },
		{ id: 3, title: 'Deadlift', value: '225 lbs', date: '2024-03-31' },
		{ id: 4, title: 'Push-ups', value: '30 reps', date: '2024-03-31' },
		{ id: 5, title: 'Squats', value: '185 lbs', date: '2024-03-31' }
	];

	function goBack() {
		goto('/');
	}

	// Generate 12 months of weekly bench press data
	function generateBenchPressData() {
		const data = [];
		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() - 11); // Start 11 months ago

		for (let month = 0; month < 12; month++) {
			// Generate 4 weekly sessions for each month
			for (let week = 0; week < 4; week++) {
				const date = new Date(startDate);
				date.setDate(date.getDate() + (month * 30) + (week * 7));

				// Generate realistic-ish volume data
				// Base volume around 3 sets of 8-12 reps at 135-185 lbs with some variation
				const sets = [
					{ weight: 135 + Math.floor(Math.random() * 50), reps: 8 + Math.floor(Math.random() * 4) },
					{ weight: 135 + Math.floor(Math.random() * 50), reps: 8 + Math.floor(Math.random() * 4) },
					{ weight: 135 + Math.floor(Math.random() * 50), reps: 8 + Math.floor(Math.random() * 4) }
				];

				const totalVolume = sets.reduce((acc, set) => acc + (set.weight * set.reps), 0);

				data.push({
					date: date.toISOString().split('T')[0],
					volume: totalVolume
				});
			}
		}

		return data;
	}

	onMount(() => {
		const ctx = document.getElementById('volumeChart') as HTMLCanvasElement;
		const data = generateBenchPressData();

		new Chart(ctx, {
			type: 'line',
			data: {
				labels: data.map(d => d.date),
				datasets: [{
					label: 'Bench Press Volume (lbs × reps)',
					data: data.map(d => d.volume),
					borderColor: '#3b82f6',
					backgroundColor: 'rgba(59, 130, 246, 0.1)',
					tension: 0.4,
					fill: true
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: 'rgba(255, 255, 255, 0.7)'
						}
					}
				},
				scales: {
					x: {
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						},
						ticks: {
							color: 'rgba(255, 255, 255, 0.7)'
						}
					},
					y: {
						grid: {
							color: 'rgba(255, 255, 255, 0.1)'
						},
						ticks: {
							color: 'rgba(255, 255, 255, 0.7)'
						}
					}
				}
			}
		});
	});
</script>

<div class="reports-page">
	<div class="top-bar">
		<button class="back-button" on:click={goBack} aria-label="Go back">
			←
		</button>
		<h1>Exercise Volume Report</h1>
	</div>

	<div class="chart-container">
		<canvas id="volumeChart"></canvas>
	</div>
</div>

<style>
	.reports-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		color: white;
		font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	}

	.top-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.back-button {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		font-size: 1.5rem;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
	}

	.back-button:hover {
		color: white;
	}

	h1 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: normal;
	}

	.chart-container {
		padding: 1rem;
		height: 70vh;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		margin: 1rem;
		backdrop-filter: blur(10px);
	}
</style>