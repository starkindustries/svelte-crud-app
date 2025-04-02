<script lang="ts">
	import { goto } from '$app/navigation';

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
</script>

<div class="reports-page">
	<div class="top-bar">
		<button class="back-button" on:click={goBack} aria-label="Go back">
			←
		</button>
		<h1>Reports</h1>
	</div>

	<div class="reports-container">
		{#each reports as report}
			<div class="report-card">
				<div class="report-header">
					<h2>{report.title}</h2>
					<span class="date">{report.date}</span>
				</div>
				<div class="report-value">
					{report.value}
				</div>
			</div>
		{/each}
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

	.reports-container {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.report-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		padding: 1rem;
	}

	.report-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.report-header h2 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: normal;
	}

	.date {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.report-value {
		font-size: 1.5rem;
		font-weight: bold;
	}
</style>